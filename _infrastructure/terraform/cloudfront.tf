
resource "null_resource" "build_and_deploy" {
  depends_on = [ aws_s3_bucket.checkers_bucket, aws_cloudfront_distribution.react_app ]
  triggers = {
    build_dir_hash = local.app_hash
  }

  provisioner "local-exec" {
    command = <<EOT
      cd ${var.react_app_path} && \
      npm install && \
      REACT_APP_API_URL=https://checkers-api.${var.domain_name}.${var.tld}  npm run build && \
      aws s3 sync build/ s3://${aws_s3_bucket.checkers_bucket.id}/ --delete
      aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.react_app.id} --paths "/*"

    EOT
  }
}


# CloudFront Distribution
resource "aws_cloudfront_distribution" "react_app" {
  aliases = ["checkers.${var.domain_name}.${var.tld}"]

  origin {
    domain_name = aws_s3_bucket.checkers_bucket.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.checkers_bucket.id}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }

  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = var.cloudfront_price_class

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.checkers_bucket.id}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl           = 3600
    max_ttl               = 86400
    compress              = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate.checkers_cert.arn
    ssl_support_method = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }
}
