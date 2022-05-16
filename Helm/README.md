# Kubernetes Helm Charts

<h1>🚀 Digital Ocean</h1>
Disclaimer: For data storage scalability these charts depend on a cloud managed MySQL database cluster

<div style="border: solid 1px">
<h2>🛠️ Installation Steps:</h2>
* prerequisite <br>
  - docker installed <br>
  - production secret environment variables set (<a href="https://github.com/JeroenMBooij/Smart-Learning/blob/main/Helm/values.production.yaml">see production.values.yaml</a>) <br><br>

<b>Existing Cluster</b>
<p> Run the following commands on your local machine</p>
docker run -it --rm -v ${PWD}:/work -w /work --entrypoint /bin/bash digitalocean/doctl:1.45.0 <br>
mv /app/doctl /usr/local/bin/ <br>
doctl auth init <br>
&nbsp;&nbsp; ***** Enter your DigitalOcean API-key ***** <br><br>
doctl kubernetes cluster kubeconfig save didac-cluster <br>
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

<b>Create new Cluster</b>
<p> Run the following commands on your local machine</p>
docker run -it --rm -v ${PWD}:/work -w /work --entrypoint /bin/bash digitalocean/doctl:1.45.0 <br>
mv /app/doctl /usr/local/bin/ <br>
doctl auth init <br>
&nbsp;&nbsp; ***** Enter your DigitalOcean API-key ***** <br><br>
doctl kubernetes cluster create didac-cluster --count 1 --size s-2vcpu-2gb --region ams3 <br>
curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl <br>
chmod +x ./kubectl <br>
mv ./kubectl /usr/local/bin/kubectl <br>
kubectl create ns didac-app <br>
curl -LO https://get.helm.sh/helm-v3.4.0-linux-amd64.tar.gz <br>
tar -C /tmp/ -zxvf helm-v3.4.0-linux-amd64.tar.gz <br>
rm helm-v3.4.0-linux-amd64.tar.gz <br>
mv /tmp/linux-amd64/helm /usr/local/bin/helm <br>
chmod +x /usr/local/bin/helm <br>
helm install didac-release . --values production.staging.yaml <br>
  
</div>

  
