{{- define "metadata" -}}
name: {{ .Values.webapp.name }}
namespace: {{ .Values.webapp.namespace | default "chat" }}
{{- end -}}