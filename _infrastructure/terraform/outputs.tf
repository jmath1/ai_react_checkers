output "registry_url" {
    value = data.terraform_remote_state.registry.outputs.registry_url
}