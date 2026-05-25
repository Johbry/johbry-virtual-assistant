# 📚 Virtual Assistant - Documentación Completa

## Índice

1. [Configuración Actual](#configuración-actual)
2. [Arquitectura](#arquitectura)
3. [Desarrollo Local](#desarrollo-local)
4. [Despliegue a Producción](#despliegue-a-producción)
5. [AWS S3 Setup](#aws-s3-setup)
6. [Logging y Debugging](#logging-y-debugging)


---

## 🎯 Configuración Actual

### Ambiente

- **Desarrollo**: Usa archivo local (`src/config/prompts/config.yaml`)
- **Producción**: Usa AWS S3 (`s3://[BUCKET_NAME]/prompts/config.yaml`)

### Stack Tecnológico

- **Frontend**: React 19.2.4 + Next.js 16.2.6
- **Backend**: Node.js + TypeScript
- **LLM**: Google Gemini 2.5-flash
- **Config Storage**: AWS S3
- **Config Format**: YAML con js-yaml parser
- **AWS SDK**: v3 (@aws-sdk/client-s3)

### Variables de Entorno (.env)

```bash
# Node environment
NODE_ENV=development

# API Keys
GEMINI_API_KEY=your_gemini_api_key

# S3 Configuration
AWS_REGION=us-east-1
PROMPT_BUCKET=[BUCKET_NAME]
PROMPT_CONFIG_KEY=prompts/config.yaml
USE_S3_PROMPTS=false          # Cambiar a true en producción

# Prompt Selection
PROMPT_KEY=AGENT_CHAT_PROMPT
```

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────┐
│           VIRTUAL ASSISTANT APP             │
│          (Next.js 16.2.6)                   │
└──────────────┬──────────────────────────────┘
               │
       ┌───────▼───────┐
       │ PromptManager │ (API pública)
       └───────┬───────┘
               │
   ┌───────────▼───────────┐
   │PromptRepositoryFactory│
   │(Selecciona repo)      │
   └───┬────────────────┬───┘
       │                │
  ┌────▼──────┐   ┌────▼────────┐
  │ Local Repo │   │ S3 Repo     │
  │(dev mode)  │   │(prod mode)  │
  └────┬──────┘   └────┬────────┘
       │                │
  ┌────▼──────┐   ┌────▼────────┐
  │config.yaml │   │  AWS S3     │
  │(local file)│   │   Bucket    │
  └────────────┘   └─────────────┘
```

### Componentes Principales

#### 1. **LocalPromptRepository** (Desarrollo)
- ✅ Lee `src/config/prompts/config.yaml` localmente
- ✅ Cachea la configuración en memoria
- ✅ Método `resetCache()` para recargar sin reiniciar

#### 2. **S3PromptRepository** (Producción)
- ✅ Lee desde AWS S3 automáticamente
- ✅ Cachea la configuración en memoria
- ✅ Maneja errores de conexión S3
- ✅ Usa AWS SDK v3
- ✅ Log de inicialización: `📦 S3PromptRepository inicializado: s3://...`

#### 3. **PromptRepositoryFactory**
- ✅ Selecciona automáticamente:
  - `LocalPromptRepository` si `NODE_ENV=development` O `USE_S3_PROMPTS=false`
  - `S3PromptRepository` si `NODE_ENV=production` O `USE_S3_PROMPTS=true`
- ✅ Logs de selección:
  - `📁 Usando LocalPromptRepository (desarrollo)`
  - `🔄 Usando S3PromptRepository (producción)`

---

## 💻 Desarrollo Local

### Instalación

```bash
npm install
```

### Iniciar Servidor de Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Workflow de Desarrollo

1. **Edita `src/config/prompts/config.yaml`**
   ```bash
   nano src/config/prompts/config.yaml
   ```

2. **Reinicia el servidor dev** (o usa `resetCache()` para no reiniciar)
   ```bash
   npm run dev
   ```

3. **Verifica los logs**
   - Deberías ver: `📁 Usando LocalPromptRepository (desarrollo)`
   - Más logs: `❌ Error cargando configuración local:` (si hay errores)

### Testing Local con S3

Si quieres probar S3 localmente sin desplegar:

```bash
# 1. Asegúrate que tienes AWS CLI configurado
aws configure

# 2. Cambia .env:
USE_S3_PROMPTS=true

# 3. Inicia:
npm run dev

# 4. Verifica los logs - deberías ver:
# 🔄 Usando S3PromptRepository (producción)
# 📦 S3PromptRepository inicializado: s3://[BUCKET_NAME]/prompts/config.yaml
```

### Build y Producción Local

```bash
# Build
npm run build

# Iniciar servidor de producción
npm start
```

---

## 🚀 Despliegue a Producción

### Requisitos Previos

1. **AWS CLI instalado**: [Descargar](https://aws.amazon.com/cli/)
2. **Credenciales AWS configuradas**: 
   ```bash
   aws configure
   ```
3. **Permisos S3**: Necesitas permisos `s3:PutObject` en el bucket

### Información del Bucket

- **Nombre**: `[BUCKET_NAME]`
- **Región**: `us-east-1`
- **Ubicación de config**: `s3://[BUCKET_NAME]/prompts/config.yaml`

### Paso 1: Prepara tu `config.yaml` Local

Asegúrate que `src/config/prompts/config.yaml` está actualizado:

```bash
cat src/config/prompts/config.yaml
```

### Paso 2: Sube a S3

```bash
# Opción A: Usando AWS CLI (recomendado)
aws s3 cp src/config/prompts/config.yaml s3://[BUCKET_NAME]/prompts/config.yaml

# Opción B: Con encriptación SSE
aws s3 cp src/config/prompts/config.yaml s3://[BUCKET_NAME]/prompts/config.yaml \
  --region us-east-1 \
  --sse AES256
```

### Paso 3: Verifica la Carga

```bash
# Lista el contenido del bucket
aws s3 ls s3://[BUCKET_NAME]/prompts/

# Descarga y verifica el contenido
aws s3 cp s3://[BUCKET_NAME]/prompts/config.yaml - | head -20
```

### Paso 4: Configura tu Plataforma de Deployment

En tu plataforma (Vercel, Railway, AWS Lambda, etc.), configura estas variables de entorno:

```bash
NODE_ENV=production
PORT=3001
GEMINI_API_KEY=your_gemini_key

# Habilita S3
USE_S3_PROMPTS=true
PROMPT_KEY=AGENT_CHAT_PROMPT

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
PROMPT_BUCKET=[BUCKET_NAME]
PROMPT_CONFIG_KEY=prompts/config.yaml
```

### Paso 5: Deploy

Despliega tu aplicación con las variables de entorno configuradas:

```bash
# Ejemplo para Vercel
vercel deploy --prod --env-file .env.production

# Ejemplo para Railway/Heroku
git push heroku main
```

### Workflow de Actualización en Producción

```bash
# 1. Edita localmente
nano src/config/prompts/config.yaml

# 2. Prueba en desarrollo
USE_S3_PROMPTS=false npm run dev

# 3. Sube a S3
aws s3 cp src/config/prompts/config.yaml s3://[BUCKET_NAME]/prompts/config.yaml

# 4. La app recarga automáticamente (sin necesidad de redeploy)
```

---

## ⚙️ Configuración de Prompts (PROMPTS_CONFIG)

### Archivos

- **`src/config/prompts/config.example.yaml`** ✅ Versionado en Git
  - Archivo de ejemplo y referencia
  - Muestra la estructura YAML correcta
  - Úsalo como template para crear `config.yaml`

- **`src/config/prompts/config.yaml`** ❌ NO versionado (en .gitignore)
  - Tu configuración personal/de proyecto
  - Contiene los prompts reales
  - Puede tener datos sensibles o específicos del proyecto

### Primeros Pasos

#### 1. Crear tu config.yaml

```bash
cp src/config/prompts/config.example.yaml src/config/prompts/config.yaml
```

#### 2. Editar config.yaml

Abre `src/config/prompts/config.yaml` y personaliza:

```yaml
llm:
  model: "gemini-2.5-flash"  # Cambia el modelo si necesitas
  temperature: 0.7           # Ajusta creatividad

prompts:
  AGENT_CHAT_PROMPT:
    content: |               # Tu prompt aquí
      Eres el agente...
```

#### 3. Usar en tu app

El archivo se carga automáticamente:
- **Desarrollo**: Desde `config.yaml` local
- **Producción**: Desde S3 `prompts/config.yaml`

### Estructura del YAML

```yaml
version: "1.0.0"          # Versión del formato

llm:                      # Configuración del LLM
  provider: "gemini"      # gemini | claude | openai
  model: "..."            # Modelo a usar
  temperature: 0.7        # 0-1, creatividad (0=determinista, 1=creativo)
  maxOutputTokens: 1024   # Máximo de tokens de salida

prompts:                  # Tus prompts
  AGENT_XXX_PROMPT:
    name: "..."           # Nombre legible
    description: "..."    # Descripción
    enabled: true         # true/false
    content: |            # Contenido (multiline)
      Contenido del prompt
      con saltos de línea naturales
```

### Agregar Nuevo Prompt

#### 1. Edita `src/config/prompts/config.yaml`

```yaml
prompts:
  # ... otros prompts ...
  
  AGENT_MY_NEW_PROMPT:
    name: "Mi Nuevo Prompt"
    description: "Descripción del prompt"
    enabled: true
    content: |
      Contenido del prompt aquí...
      Puede tener múltiples líneas
```

#### 2. Actualiza el `PROMPT_KEY` en `.env`

```bash
PROMPT_KEY=AGENT_MY_NEW_PROMPT
```

#### 3. Reinicia el servidor

```bash
npm run dev
```

### Configuración en Producción (S3)

#### 1. Sube el archivo a S3

```bash
aws s3 cp src/config/prompts/config.yaml s3://[BUCKET_NAME]/prompts/config.yaml
```

#### 2. Configura las variables de entorno

En tu plataforma de deployment:

```bash
USE_S3_PROMPTS=true
PROMPT_BUCKET=[BUCKET_NAME]
PROMPT_CONFIG_KEY=prompts/config.yaml
PROMPT_KEY=AGENT_CHAT_PROMPT
```

#### 3. La app carga automáticamente desde S3

Sin necesidad de redeploy

### ⚠️ Notas Importantes

- **NO commitees `config.yaml`** - Contiene datos personales/sensibles
- **Sí commitea `config.example.yaml`** - Es la referencia pública
- Mantén `config.example.yaml` actualizado cuando cambies la estructura
- El archivo se cachea en memoria - cambios en S3 se cargan automáticamente

### 💡 Tips

- ✅ Usa `|` en YAML para multiline strings (preserva saltos de línea)
- ✅ Puedes tener tantos prompts como necesites
- ✅ Solo el prompt con `PROMPT_KEY` se carga
- ✅ Los prompts con `enabled: false` siguen disponibles pero no se cargan
- ✅ Temperature: 0 = respuestas deterministas, 1 = respuestas creativas
- ✅ maxOutputTokens: ajusta según necesidad (menos tokens = respuesta más corta)

---

## 🔧 AWS S3 Setup

### Instalación de Dependencias

Las siguientes librerías ya están incluidas en `package.json`:

```json
{
  "dependencies": {
    "@aws-sdk/client-s3": "^3.1053.0",
    "js-yaml": "^4.1.1"
  }
}
```

### Instalación Manual

Si por alguna razón necesitas instalarlas de nuevo:

```bash
npm install @aws-sdk/client-s3 js-yaml
npm install
```

### Verificación del Setup

Para verificar que S3 está configurado correctamente:

```bash
# 1. Verifica las variables de entorno
env | grep AWS
env | grep PROMPT

# 2. Verifica credenciales AWS
aws sts get-caller-identity

# 3. Verifica que el bucket existe
aws s3 ls | grep [BUCKET_NAME]

# 4. Verifica el archivo en S3
aws s3 ls s3://[BUCKET_NAME]/prompts/
```

---

## 📊 Logging y Debugging

### Logs de Inicialización

La app imprime logs cuando inicia para indicar qué repositorio se está usando:

#### En Desarrollo (LOCAL)
```
📁 Usando LocalPromptRepository (desarrollo)
```

#### En Producción (S3)
```
🔄 Usando S3PromptRepository (producción)
📦 S3PromptRepository inicializado: s3://[BUCKET_NAME]/prompts/config.yaml
```

### Logs de Error

**LocalPromptRepository:**
```
❌ Error cargando configuración local: Error: Archivo no encontrado: src/config/prompts/config.yaml
```

**S3PromptRepository:**
```
❌ Error cargando configuración de S3: Error: Access Denied
❌ Error en S3PromptRepository.getResolvedPrompt("AGENT_CHAT_PROMPT"): Error: Prompt not found
❌ S3PromptRepository no disponible: Error: NoSuchBucket
```

### Cómo Verificar que Todo Funciona

1. **Revisa los logs** en la consola o plataforma de deployment
2. **Busca el log de inicialización** (📁 o 🔄)
3. **Realiza una llamada a `/api/chat`** y verifica que funcione
4. **Verifica que el prompt se carga** correctamente desde la fuente esperada

### Debugging Avanzado

Para debug más detallado, puedes modificar temporalmente los repositorios:

```typescript
// En S3PromptRepository.ts
async getConfiguration(): Promise<PromptConfiguration> {
  console.log('DEBUG: Intentando cargar de S3...');
  console.log('DEBUG: Bucket:', this.bucket);
  console.log('DEBUG: Key:', this.configKey);
  
  // ... resto del código
}
```

---

## 📝 Resumen de Flujos

### Workflow Local (Desarrollo)

```
1. npm install
2. Edita src/config/prompts/config.yaml
3. npm run dev
4. Verifica logs: "📁 Usando LocalPromptRepository"
5. Realiza cambios, servidor auto-recarga
```

### Workflow Producción

```
1. npm install
2. Edita src/config/prompts/config.yaml localmente
3. npm run dev (prueba con USE_S3_PROMPTS=false)
4. aws s3 cp src/config/prompts/config.yaml s3://...
5. Configura USE_S3_PROMPTS=true en plataforma
6. Deploy con variables de entorno
7. Verifica logs: "🔄 Usando S3PromptRepository"
8. Prueba con /api/chat
```

### Actualizar Configuración en Producción (Sin Redeploy)

```
1. Edita src/config/prompts/config.yaml localmente
2. Sube a S3: aws s3 cp src/config/prompts/config.yaml s3://...
3. La app recarga automáticamente (respeta caché)
4. No necesita redeploy de la aplicación
```

---


**Última actualización**: Mayo 2026  
**Versión del proyecto**: 0.1.0  
**Maintainer**: Johbry
