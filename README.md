Det pet project lyeth hier.

Usually ran with k3s and Nginx Ingress controller.
Used helm charts: [kube-prometheus-stack](https://prometheus-community.github.io/helm-charts ), [bitnami metrics](https://charts.bitnami.com/bitnami), [nginx ingress](https://kubernetes.github.io/ingress-nginx), [nfs-subdir-external-provisioner](https://kubernetes-sigs.github.io/nfs-subdir-external-provisioner/)


TBA: ~~metrics, monitoring manifests, edit endpoint in 5/00, bitnami metrics chart, Helm chart version of the app~~, RBAC, ansible playbook for running everything, Ceph, zero downtime, edit flux, add kps to the helm chart version, add other daemonsets to the app.