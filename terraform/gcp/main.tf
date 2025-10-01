provider "google" {
  project = var.project_id
  region  = var.region
}

# Artifact Registry (Docker images)
resource "google_artifact_registry_repository" "ryzer" {
  provider      = google
  location      = var.region
  repository_id = "ryzer-repo"
  format        = "DOCKER"
}

# Cloud SQL (Postgres)
resource "google_sql_database_instance" "ryzer_db" {
  name             = "ryzer-db"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier = "db-f1-micro"
    ip_configuration {
      authorized_networks = []
      ipv4_enabled        = true
    }
  }
}

resource "google_sql_database" "db" {
  name     = "ryzer_db"
  instance = google_sql_database_instance.ryzer_db.name
}

resource "google_sql_user" "postgres" {
  name     = "postgres"
  instance = google_sql_database_instance.ryzer_db.name
  password = "postgres"
}

# Cloud Run Service
resource "google_cloud_run_service" "ryzer_app" {
  name     = "ryzer-app"
  location = var.region

  template {
    spec {
      containers {
        image = "${google_artifact_registry_repository.ryzer.repository_url}/ryzer-app:latest"
        ports {
          container_port = 3000
        }
      }
    }
  }

  traffics {
    percent         = 100
    latest_revision = true
  }

  autogenerate_revision_name = true
}

resource "google_cloud_run_service_iam_member" "public" {
  service  = google_cloud_run_service.ryzer_app.name
  location = var.region
  role     = "roles/run.invoker"
  member   = "allUsers"
}
