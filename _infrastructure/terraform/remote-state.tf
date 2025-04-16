
data "terraform_remote_state" "domain" {
    backend = "s3"
    config = {
        bucket = "jonathanmathcom-terraform-state"
        key    = "domain.tfstate"
        region = "us-east-1"
    }
}
