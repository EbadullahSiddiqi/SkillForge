output "cluster_endpoint" {
  description = "EKS cluster API endpoint"
  value       = aws_eks_cluster.skillforge.endpoint
}

output "cluster_name" {
  value = aws_eks_cluster.skillforge.name
}
