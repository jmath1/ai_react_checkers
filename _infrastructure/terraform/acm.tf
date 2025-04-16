resource "aws_acm_certificate" "checkers_cert" {

  domain_name       = "checkers.${var.domain_name}.${var.tld}"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}


resource "aws_route53_record" "checkers_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.checkers_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = local.zone_id
  name    = each.value.name
  records = [each.value.record]
  type    = each.value.type
  ttl     = 60
}