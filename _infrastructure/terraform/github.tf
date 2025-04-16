data "aws_iam_openid_connect_provider" "existing_github_runner_provider" {
    url = "https://token.actions.githubusercontent.com"
}

resource "aws_iam_openid_connect_provider" "github_runner_provider" {
    # create if it doesnt already exist
    count          = length(data.aws_iam_openid_connect_provider.existing_github_runner_provider.id) == 0 ? 1 : 0
    client_id_list = ["sts.amazonaws.com"]
    thumbprint_list = ["${var.github_thumbprint}"]

    url = "https://token.actions.githubusercontent.com"
}


data "aws_iam_policy_document" "github_allow" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [ 
        length(data.aws_iam_openid_connect_provider.existing_github_runner_provider.id) == 0 ? 
        aws_iam_openid_connect_provider.github_runner_provider[0].arn : 
        data.aws_iam_openid_connect_provider.existing_github_runner_provider.arn ]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_repository_owner}/${var.github_repository_repo}:*"]
    }
  }
}

resource "aws_iam_policy" "github_policy" {
  name        = "CheckersRunnerPolicy"
  description = "Allows GitHub Actions to upload to s3 and make a new cloudfront cache invalidation"
  policy      = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:ListBucket",
                "s3:DeleteObject",
                "s3:PutBucketPolicy",
                "s3:PutBucketWebsite"
            ],
            "Resource": ["*"]
        },
      {
          "Effect": "Allow",
          "Action": [
              "cloudfront:CreateInvalidation",
              "cloudfront:GetDistribution",
              "cloudfront:UpdateDistribution"
          ],
          "Resource": "*"
      },
      {
          "Effect": "Allow",
          "Action": [
              "iam:CreateServiceLinkedRole"
          ],
          "Resource": "*",
          "Condition": {
              "StringEquals": {
                  "iam:AWSServiceName": "cloudfront.amazonaws.com"
              }
          }
      }
    ]
}
EOF
}

resource "aws_iam_role" "github_runner_role" {
  name               = "CheckersGithubRunner"
  assume_role_policy = data.aws_iam_policy_document.github_allow.json
}

resource "aws_iam_role_policy_attachment" "github_policy_attach" {
  role       = aws_iam_role.github_runner_role.name
  policy_arn = aws_iam_policy.github_policy.arn
}


resource "github_actions_secret" "aws_account_number" {
  repository      = var.github_repository_repo
  secret_name     = "AWS_ACCOUNT_NUMBER"
  plaintext_value = var.aws_account_number
}

resource "github_actions_secret" "s3_bucket_name" {
  repository  = var.github_repository_repo
  secret_name = "S3_BUCKET_NAME"
  plaintext_value = var.bucket_name
}