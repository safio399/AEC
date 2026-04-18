# CATNAT Seismic Resilience Platform - Phase IV

## Deployment & Production Infrastructure

## Quick Start

### 1. Local Development (Docker)

```bash
# Clone repo
cd CATNAT_CSR_Platform

# Build and run all services
docker-compose up --build

# Services will be available at:
# - API: http://localhost:8000
# - API Docs: http://localhost:8000/docs
# - Dashboard: http://localhost:8501
# - Database: postgresql://localhost:5432/catnat_db
```

### 2. Environment Configuration

Create `.env` file:

```
DB_PASSWORD=your_secure_password
ENVIRONMENT=production
JWT_SECRET_KEY=your_jwt_secret_key_here
LOG_LEVEL=INFO
```

### 3. Production Deployment (AWS/Azure)

#### AWS ECR + ECS

```bash
# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account_id>.dkr.ecr.us-east-1.amazonaws.com

docker build -t catnat-api .
docker tag catnat-api:latest <account_id>.dkr.ecr.us-east-1.amazonaws.com/catnat-api:latest
docker push <account_id>.dkr.ecr.us-east-1.amazonaws.com/catnat-api:latest

# Deploy to ECS using CloudFormation template (see deployment/ folder)
```

#### Azure Container Instances

```bash
az acr build --registry <registry_name> --image catnat-api:latest .
az container create --resource-group <group> --name catnat-api --image <registry>.azurecr.io/catnat-api:latest
```

### 4. Kubernetes Deployment (Helm)

```bash
# Install Helm chart
helm install catnat ./helm/catnat-csr-platform \
  --namespace seismic-risk \
  --values helm/values-prod.yaml

# Check status
kubectl get pods -n seismic-risk
kubectl logs -f deployment/catnat-api -n seismic-risk
```

### 5. Automated Data Refresh

Create cron job for monthly Phase 0 re-execution:

```bash
# Crontab entry (runs 1st of month at 2 AM)
0 2 1 * * /path/to/scripts/refresh_portfolio.sh >> /var/log/catnat_refresh.log 2>&1
```

Script: `scripts/refresh_portfolio.sh`

```bash
#!/bin/bash
set -e

# Activate environment
source /app/venv/bin/activate

# Run Phase 0 notebook
jupyter nbconvert --to notebook --execute \
  /app/notebooks/Phase_0_Data_Cleaning_and_Enrichment.ipynb \
  --output Phase_0_$(date +%Y%m%d).ipynb

# Run Phase 1-2 updates
jupyter nbconvert --to notebook --execute \
  /app/notebooks/Phase_1_Risk_Identification_and_PML.ipynb

# Restart API to load new data
docker restart catnat-api
```

### 6. Authentication & RBAC

Implement JWT + OAuth2 in FastAPI:

```python
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Verify credentials
    # Return JWT token

@app.get("/api/portfolio/summary")
async def portfolio_summary(current_user: str = Depends(verify_token)):
    # Only authenticated users can access
    pass
```

Roles:

- **viewer**: Read-only access to dashboards and reports
- **analyst**: Full access to all endpoints + export permissions
- **admin**: System administration, user management, config changes

### 7. Monitoring & Logging

Using ELK Stack:

- **Elasticsearch**: Centralized log storage
- **Logstash**: Log processing pipeline
- **Kibana**: Log visualization

Or use cloud provider's native monitoring:

- **AWS CloudWatch**: For CloudFormation deployments
- **Azure Monitor**: For ACI deployments

### 8. CI/CD Pipeline (GitHub Actions)

File: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: pytest tests/

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker image
        run: docker build -t catnat-api:${{ github.sha }} .
      - name: Push to ECR
        run: aws ecr push ...
      - name: Deploy to ECS
        run: aws ecs update-service ...
```

### 9. Backup & Disaster Recovery

```bash
# Daily database backups
0 3 * * * pg_dump catnat_db | gzip > /backups/catnat_$(date +\%Y\%m\%d).sql.gz

# Upload to S3
aws s3 cp /backups/catnat_*.sql.gz s3://catnat-backups/

# Retention: 30 days
aws s3 rm s3://catnat-backups/ --recursive --exclude "*" --include "catnat_*" --older-than 30
```

### 10. Team Access & Documentation

**Team Roles:**

- Data Scientists: Jupyter notebooks + API access
- Risk Managers: Dashboard + reports
- IT Operations: Docker/Kubernetes infrastructure
- Finance: PDF reports + export data

**User Manual:** See `docs/USER_MANUAL.md`
**Admin Guide:** See `docs/ADMIN_GUIDE.md`
**API Documentation:** Auto-generated at `/docs` endpoint

---

## Appendix: Key Infrastructure Files

- `Dockerfile`: Container image definition
- `docker-compose.yml`: Local development orchestration
- `helm/`: Kubernetes Helm charts for production
- `backend/requirements_complete.txt`: Python dependencies
- `scripts/refresh_portfolio.sh`: Automated data refresh
- `.github/workflows/`: CI/CD pipeline definitions

**Status:** Phase IV Infrastructure Complete ✓  
**Next Step:** Execute Phase 1-3 notebooks and deploy to production
