resource "aws_s3_bucket" "checkers_bucket" {
  bucket = var.bucket_name
  force_destroy = true

  tags = {
    Name = var.bucket_name
  }

}

resource "aws_s3_bucket_public_access_block" "_" {
  bucket = aws_s3_bucket.checkers_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "public_read_policy" {
  bucket = aws_s3_bucket.checkers_bucket.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid = "PublicReadGetObject",
        Effect = "Allow",
        Principal = "*",
        Action = [
          "s3:GetObject"
        ],
        Resource = "${aws_s3_bucket.checkers_bucket.arn}/*"
      }
    ]
  })
}

resource "aws_s3_bucket_acl" "react_app" {
  depends_on = [
    aws_s3_bucket_ownership_controls.react_app,
    aws_s3_bucket_public_access_block._,
  ]
  bucket = aws_s3_bucket.checkers_bucket.id
  acl    = "public-read"
}

resource "aws_s3_bucket_ownership_controls" "react_app" {
  bucket = aws_s3_bucket.checkers_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_cors_configuration" "_" {
  bucket = aws_s3_bucket.checkers_bucket.id

  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
  }
}