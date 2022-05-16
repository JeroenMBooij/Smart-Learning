# 🚀 Kubernetes Helm Charts

Disclaimer: <i>For data storage scalability these charts depend on a cloud managed MySQL database cluster</i> <br>
Coupon Link from DigitalOcean to get $100 credit for 60 days: <br/>
https://m.do.co/c/74a1c5d63dac

<h2>🛠️ Installation Steps DigitalOcean:</h2>
prerequisite 
<ul>
  <li> docker installed </li> 
  <li> production secret environment variables set (<a href="https://github.com/JeroenMBooij/Smart-Learning/blob/main/Helm/values.production.yaml">see   production.values.yaml</a>) </li> 
</ul>

<br>

<p> Execute the following commands on your local machine</p>
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
  

  
