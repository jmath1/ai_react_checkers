locals {
    zone_id = data.terraform_remote_state.domain.outputs.route53_zone.id
    app_hash = sha1(
      join("", 
        concat(
          [for f in fileset("${var.react_app_path}/src", "**"): filesha1("${var.react_app_path}/src/${f}")],
          [for f in fileset("${var.react_app_path}/public", "**"): filesha1("${var.react_app_path}/public/${f}")],
          [filesha1("${var.react_app_path}/package.json")],
          [filesha1("${var.react_app_path}/package-lock.json")],
        )
      )
    )
}