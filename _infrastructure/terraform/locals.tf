locals {
    ec2_instance_ip_address = data.terraform_remote_state.web.outputs.ec2_public_ip
    ssh_private_key_path = data.terraform_remote_state.web.outputs.ssh_private_key_path
    zone_id = data.terraform_remote_state.domain.outputs.route53_zone.id
}