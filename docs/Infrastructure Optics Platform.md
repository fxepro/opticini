# Opticini – Infrastructure Optics Platform

**Optics + Insight into Local, Hybrid & Cloud Infrastructure**

---

## 1️⃣ Infrastructure Discovery & Inventory

**"What do we have?"**

### Tools

- Network discovery (ARP, SNMP, LLDP)
- Host discovery (ICMP, TCP SYN)
- Cloud asset discovery (AWS, Azure, GCP APIs)
- VM & container discovery
- CMDB-lite auto-mapping
- Tag normalization (env, owner, criticality)

### Metrics

- Total assets by type (server / VM / container / DB)
- Asset drift (new / removed assets)
- Orphaned resources
- Cloud resource sprawl
- % tagged vs untagged assets

---

## 2️⃣ Server & Host Monitoring

**"Are servers healthy?"**

### Tools

- Agent-based monitoring
- Agentless (SSH, WinRM, SNMP)
- Process monitoring
- Service availability checks
- Hardware sensors (IPMI)

### Metrics

- CPU usage (avg, peak)
- Memory usage & swap
- Disk I/O & space
- Load average
- Uptime / downtime
- Process crashes
- Hardware health (temp, fan, PSU)

---

## 3️⃣ Network & Connectivity Monitoring

**"Can systems talk to each other?"**

### Tools

- Ping & latency probes
- Traceroute mapping
- Port/service availability scans
- NetFlow/sFlow ingestion
- Bandwidth usage tracking
- VPN & tunnel monitoring

### Metrics

- Latency (p50/p95/p99)
- Packet loss
- Jitter
- Throughput
- Open vs expected ports
- Network saturation
- VPN uptime

---

## 4️⃣ Cloud & Hybrid Infrastructure Monitoring

**"What's happening across AWS / Azure / GCP?"**

### Tools

- CloudWatch / Azure Monitor / Stackdriver ingestion
- Cost & usage APIs
- Autoscaling event tracking
- Cross-account visibility
- IAM permission analysis

### Metrics

- Instance health
- Autoscaling events
- API error rates
- Cloud service availability
- Cost per service / team / env
- Idle resource cost
- IAM risk score

---

## 5️⃣ Application & Service Health (APM-lite)

**"Are apps performing for users?"**

### Tools

- Service-level health checks
- HTTP/API probes
- Background synthetic transactions
- Dependency mapping
- Queue & worker monitoring

### Metrics

- Response times
- Error rates
- Service uptime
- Dependency latency
- Queue depth
- Failed jobs

---

## 6️⃣ Security Posture & Exposure

**"How exposed are we?"**

### Tools

- Open port detection
- Weak service configuration checks
- OS & package vulnerability scans
- CIS benchmark checks
- SSH / RDP exposure monitoring
- Firewall rule analysis

### Metrics

- Exposed services count
- CVEs by severity
- Patch compliance %
- Insecure configs detected
- Attack surface size
- Drift from baseline

> ⚠️ **Note:** This is security-adjacent, not full SIEM (good positioning).

---

## 7️⃣ Compliance & Configuration Drift

**"Are systems still configured correctly?"**

### Tools

- Baseline configuration snapshots
- File integrity monitoring
- Config diffing
- Policy-as-code checks
- Compliance templates (SOC2, HIPAA-lite)

### Metrics

- Drift events
- Config change frequency
- Non-compliant systems
- Time-to-remediate
- Policy violations

---

## 8️⃣ Performance Trends & Capacity Planning

**"What will break next month?"**

### Tools

- Historical metrics storage
- Forecasting models
- Resource saturation alerts
- Growth trend analysis

### Metrics

- CPU/memory growth rate
- Disk exhaustion forecast
- Network growth trends
- Capacity risk score
- Time-to-capacity limit

---

## 9️⃣ Incident Detection & Alerting

**"Tell me when something matters."**

### Tools

- Threshold-based alerts
- Anomaly detection (ML-light)
- Alert deduplication
- Alert routing (Slack, PagerDuty, email)
- Incident timelines

### Metrics

- MTTA / MTTD
- MTTR
- Alert noise ratio
- Incident frequency
- Root cause classification

---

## 🔟 Audit Logs & Change Intelligence

**"Who changed what?"**

### Tools

- Change tracking (infra, cloud, config)
- User & role activity logs
- Deployment tracking
- Infra-as-code diffing

### Metrics

- Change velocity
- Failed change rate
- Unauthorized changes
- Change-to-incident correlation

---

## 1️⃣1️⃣ Cost, Efficiency & Waste Analytics

**"Where is money leaking?"**

### Tools

- Cloud cost ingestion
- Idle resource detection
- Rightsizing suggestions
- Cost anomaly detection

### Metrics

- Cost by team/app/env
- Idle resource cost
- Cost trend
- Savings potential
- Budget burn rate

---

## 1️⃣2️⃣ Unified Dashboards & Executive Views

**"Show me the story."**

### Tools

- Role-based dashboards
- Heat maps
- Risk scoring
- Business-impact overlays
- Exportable reports

### Metrics

- Infrastructure Health Score
- Security Risk Score
- Availability Score
- Cost Efficiency Score
- SLA compliance %

