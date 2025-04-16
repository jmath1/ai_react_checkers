resource "aws_route53_record" "react_app_route" {
  zone_id = data.terraform_remote_state.domain.outputs.route53_zone.id
  name    = "checkers.jonathanmath.com"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.react_app.domain_name
    zone_id                = aws_cloudfront_distribution.react_app.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www_react_app_route" {
  zone_id = data.terraform_remote_state.domain.outputs.route53_zone.id
  name    = "www.checkers.jonathanmath.com"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.react_app.domain_name
    zone_id                = aws_cloudfront_distribution.react_app.hosted_zone_id
    evaluate_target_health = false
  }
}


resource "aws_route53_record" "checkers_api" {
  zone_id = data.terraform_remote_state.domain.outputs.route53_zone.id
  name    = "checkers-api.jonathanmath.com"
  type    = "A"
  ttl     = 300
  records = [local.ec2_instance_ip_address]
}