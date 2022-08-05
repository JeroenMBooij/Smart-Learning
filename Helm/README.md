# 🚀 Kubernetes Helm Charts

prerequisite 
<ul>
  <li> docker installed </li> 
  <li> production secret environment variables set (<a href="https://github.com/JeroenMBooij/Smart-Learning/blob/main/Helm/values.production.yaml">see   production.values.yaml</a>) </li> 
</ul>

<br>

<h2>🛠️ Installation Steps Azure:</h2>

<p> Execute the following commands on your local machine inside the Smart-Learning/Helm folder</p>
docker run -it --rm -v ${PWD}:/work -w /work --entrypoint /bin/sh booij/azure-helm-cli:latest

<h3>Login to Azure</h3>
az login

az account list -o table

<h3>💻Create Cluster</h3>

<h4>Existing Cluster</h4>
source init-cluster -s \ --subscription-id=506f6bf7-19b7-41c5-bad5-36fe386c6255 \
--resourcegroup didac-group

az aks list -o table

<h4>New Cluster</h4>

az aks get-versions --location westeurope --output table

source init-cluster -s \ --subscription-id=506f6bf7-19b7-41c5-bad5-36fe386c6255 \
--resourcegroup didac-group \
--az-location westeurope \
--sp-name didac-sp \
--cluster-name didac-cluster \
-v 1.23.8

<h3>🤖 Setup kubectl</h3>

kubectl create ns didac-app

helm install didac-release . --values values.production.yaml -n didac-app

kubectl -n didac-app get svc

<h3>🍰Node Pools</h3>
az aks nodepool list --resource-group $RESOURCEGROUP --cluster-name $CLUSTER_NAME -o table

az aks nodepool add \
--resource-group $RESOURCEGROUP \
--cluster-name $CLUSTER_NAME \
--name [node pool name] \
--node-count 1 \
--node-vm-size [node vm size] \
--labels key=value \
--node-taints key=value:NoSchedule \
--no-wait

nodeSelector:
  key: value

toleration:
  - key: "key"
    operator: "Equal"
    value: "value"
    effect: "NoSchedule"

<h3>Auto Scale</h3>
<h4>Nodes</h4>
az aks update --resource-group $RESOURCEGROUP --name [scaler name] --enable-cluster-autoscaler --min-count ? --max-count ?

kubectl scale deploy [deployment name] --replicas=50

kubectl get configmap -n [configmap name] cluster-autoscaler-status -o yaml


<h4>Pods</h4>
kubectl autoscale deployment [deployment name] --max=? --min=? --cpu-percent=85


kubectl run -i --tty load-generator --rm --image=busybox --restart=Never -- /bin/sh -c "while sleep 0.01; do wget -q -O [curl command]"


<h3>Clean Up</h3>
source cleanup-cluster


<h2>🛠️ Installation Steps DigitalOcean:</h2>


<p> Execute the following commands on your local machine inside the Smart-Learning/Helm folder</p>
<h2>🛡️ Setup environment </h2>
docker run -it --rm -v ${PWD}:/work -w /work --entrypoint /bin/bash digitalocean/doctl:1.45.0 <br>
mv /app/doctl /usr/local/bin/ <br>
doctl auth init <br>
&nbsp;&nbsp; ***** Enter your DigitalOcean API-key ***** <br><br>

<h2>🍰 Setup Existing Cluster</h2>
doctl kubernetes cluster kubeconfig save didac-cluster <br>

<h2>💻 Or setup new Cluster</h2>
doctl kubernetes cluster create didac-cluster --count 1 --size s-2vcpu-2gb --region ams3 <br>

<h2>🤖 Install tooling and the Didac application </h2>
curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl <br>
chmod +x ./kubectl <br>
mv ./kubectl /usr/local/bin/kubectl <br>
kubectl create ns didac-app <br>
curl -LO https://get.helm.sh/helm-v3.4.0-linux-amd64.tar.gz <br>
tar -C /tmp/ -zxvf helm-v3.4.0-linux-amd64.tar.gz <br>
rm helm-v3.4.0-linux-amd64.tar.gz <br>
mv /tmp/linux-amd64/helm /usr/local/bin/helm <br>
chmod +x /usr/local/bin/helm <br>
helm install didac-release . --values production.staging.yaml <br><br><br>
  

  
