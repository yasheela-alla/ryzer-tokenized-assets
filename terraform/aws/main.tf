provider "aws" {
  region = "ap-south-1"
}

# VPC
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "4.0.2"

  name = "ryzer-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["ap-south-1a","ap-south-1b"]
  private_subnets = ["10.0.1.0/24","10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24","10.0.102.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true
}

# Security Group
resource "aws_security_group" "ecs_sg" {
  name        = "ryzer-ecs-sg"
  description = "Allow HTTP/HTTPS"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ECR Repository
resource "aws_ecr_repository" "ryzer" {
  name = "ryzer-app"
}

# ECS Cluster
resource "aws_ecs_cluster" "ryzer" {
  name = "ryzer-cluster"
}

# ECS Task Definition
resource "aws_ecs_task_definition" "ryzer" {
  family                   = "ryzer-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([{
    name      = "ryzer-container"
    image     = "${aws_ecr_repository.ryzer.repository_url}:latest"
    essential = true
    portMappings = [
      { containerPort = 3000, hostPort = 3000 }
    ]
  }])
}

# ECS Service
resource "aws_ecs_service" "ryzer" {
  name            = "ryzer-service"
  cluster         = aws_ecs_cluster.ryzer.id
  task_definition = aws_ecs_task_definition.ryzer.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = module.vpc.public_subnets
    security_groups = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }
}
