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



# resource "aws_iam_role_policy" "uploader_policy" {
#   name = "uploader-policy"
#   role = aws_iam_role.portfolio_role.name

#   policy = jsonencode({
#     Version = "2012-10-17",
#     Statement = [
#       {
#         Effect = "Allow",
#         Action = [
#             "s3:PutObject",
#             "s3:PutObjectAcl",
#             "s3:GetObject",
#             "s3:ListBucket",
#             "s3:DeleteObject"
#         ],
#         Resource = [
#             "${aws_s3_bucket.checkers_bucket.arn}",
#             "${aws_s3_bucket.checkers_bucket.arn}/*",
#         ]
#       }
#     ]
#   })
# }


resource "aws_s3_bucket_cors_configuration" "_" {
  bucket = aws_s3_bucket.checkers_bucket.id

  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
  }
}