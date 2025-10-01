output "ecs_cluster_id" {
  value = aws_ecs_cluster.ryzer.id
}

output "ecr_repo_url" {
  value = aws_ecr_repository.ryzer.repository_url
}
