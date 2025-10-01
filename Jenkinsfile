pipeline {
    agent any
    environment {
        AWS_DEFAULT_REGION = 'us-east-1'
        IMAGE_NAME = "ryzer-app"
        GCP_PROJECT_ID = "<YOUR_GCP_PROJECT>"
    }
    stages {
        stage('Checkout') {
            steps { git branch: 'main', url: 'hhttps://github.com/yasheela-alla/ryzer-tokenized-assets.git' }
        }
        stage('Build Docker') { steps { sh 'docker build -t $IMAGE_NAME .' } }
        stage('Security Scan') { steps { sh 'security/trivy-scan.sh $IMAGE_NAME || true' } }
        stage('Push to AWS ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region $AWS_DEFAULT_REGION \
                | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
                docker tag $IMAGE_NAME:latest ${AWS_ACCOUNT_ID}.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_NAME:latest
                docker push ${AWS_ACCOUNT_ID}.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_NAME:latest
                '''
            }
        }
        stage('Deploy to AWS ECS') { steps { sh 'cd terraform/aws && terraform init && terraform apply -auto-approve' } }
        stage('Push to GCP Artifact Registry') {
            steps {
                sh '''
                gcloud auth activate-service-account --key-file=${{ secrets.GCP_CREDENTIALS }}
                gcloud auth configure-docker asia-south1-docker.pkg.dev
                IMAGE_URI=asia-south1-docker.pkg.dev/$GCP_PROJECT_ID/ryzer-repo/ryzer-app:latest
                docker tag $IMAGE_NAME:latest $IMAGE_URI
                docker push $IMAGE_URI
                '''
            }
        }
        stage('Deploy to GCP Cloud Run') { steps { sh 'cd terraform/gcp && terraform init && terraform apply -auto-approve' } }
    }
}
