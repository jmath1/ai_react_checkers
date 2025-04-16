resource "local_file" "ansible_inventory" {
  filename = "${path.module}/../../inventory.ini"
  content  = <<-EOT
  [portfolio]
  ${local.ec2_instance_ip_address} ansible_user=ubuntu ansible_ssh_private_key_file=${local.ssh_private_key_path}
  EOT

}