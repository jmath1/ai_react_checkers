provider "aws" {
  region = "us-east-1"
}



terraform {
  backend "s3" {
    bucket = "jonathanmathcom-terraform-state"
    key    = "checkers.tfstate"
    region = "us-east-1"
  }
}
