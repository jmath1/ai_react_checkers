variable "cloudfront_price_class" {
  description = "CloudFront price class (100, 200, or All)"
  type        = string
  default     = "PriceClass_100" # US/Canada/Europe
}

variable "domain_name" {
  description = "Domain name for the CloudFront distribution"
  type        = string
}

variable "tld" {
  description = "Top-level domain (TLD) for the CloudFront distribution"
  type        = string
  default     = "com"
}

variable "react_app_path" {
  description = "Path to the React app build directory"
  type        = string
}

variable "bucket_name" {
  description = "Name of the S3 bucket for the React app"
  type        = string
}