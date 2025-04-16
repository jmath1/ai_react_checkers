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

variable "github_thumbprint" {
  type    = string
  default = "6938fd4d98bab03faadb97b34396831e3780aea1"
}

variable "github_repository_owner" {
  description = "GitHub repository owner"
  type        = string
  default     = "jmath1"
}

variable "github_repository_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "ai_react_checkers"
}

variable "aws_account_number" {
  description = "AWS account number"
  type        = string
}

variable "github_token" {
  description = "GitHub token for Actions"
  type        = string
}