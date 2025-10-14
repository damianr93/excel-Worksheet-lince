# Excel Mica Reporte - Workspace

Sistema web para procesamiento automatizado de reportes Excel.

## 🚀 Características

- ✅ **Carga de archivos XLS/XLSX** - Compatible con archivos del sistema legacy
- ✅ **Edición en tiempo real** - Interfaz tipo spreadsheet para trabajar cómodamente
- ✅ **Cálculos automáticos** - La comisión en pesos se calcula automáticamente
- ✅ **Totales dinámicos** - Suma automática de columnas principales
- ✅ **Exportación a Excel** - Descarga el archivo procesado con todos los cambios
- ✅ **100% Frontend** - No requiere backend, todos los datos se procesan en el navegador
- ✅ **Diseño responsivo** - Funciona en desktop, tablet y móvil

## 🛠️ Stack Tecnológico

- **Vite** - Build tool ultrarrápido
- **React 18** - Framework UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **Zustand** - Gestión de estado ligera
- **xlsx (SheetJS)** - Lectura y escritura de Excel
- **Lucide React** - Iconos modernos

## 📁 Arquitectura

El proyecto sigue **Screaming Architecture**, organizado por features:

```
src/
├── features/
│   ├── excel-upload/       # Carga de archivos
│   ├── data-table/         # Tabla editable
│   └── excel-export/       # Exportación
├── shared/
│   ├── components/         # Componentes reutilizables
│   ├── store/             # Estado global (Zustand)
│   ├── types/             # TypeScript types
│   └── utils/             # Utilidades (parsers, cálculos)
└── App.tsx
```

## 🚀 Instalación y Uso

### Instalar dependencias
```bash
npm install
```

### Modo desarrollo
```bash
npm run dev
```

### Build para producción
```bash
npm run build
```

### Preview del build
```bash
npm run preview
```

## 📋 Flujo de Trabajo

1. **Cargar Excel**: Usuario sube el archivo XLS del sistema
2. **Editar datos**: 
   - Ingresa el porcentaje de comisión para cada producto
   - Ingresa valores de PERC IIBB y RET IIBB
   - La columna "$ Comisión" se calcula automáticamente
3. **Ver totales**: Las sumas se actualizan en tiempo real
4. **Exportar**: Descarga el Excel procesado con todos los cambios

## 🎨 Diseño

- **Colores sobrios** con acentos profesionales
- **Inputs destacados** con fondos de color para fácil identificación
- **Tabla responsiva** con scroll horizontal en móviles
- **Feedback visual** en acciones del usuario

## 🔧 Escalabilidad

El código está preparado para agregar nuevas funcionalidades:

- ✅ Estructura modular por features
- ✅ Tipos TypeScript bien definidos
- ✅ Componentes reutilizables
- ✅ Separación de lógica de negocio
- ✅ Estado centralizado y predecible

## 📦 Despliegue

Puedes desplegar en cualquier servicio de hosting estático:

- **Vercel** (recomendado)
- **Netlify**
- **GitHub Pages**
- **Cloudflare Pages**

Todos ofrecen planes gratuitos y despliegue automático desde Git.

## 🔒 Privacidad

Los datos **NUNCA** salen del navegador. Todo el procesamiento se realiza localmente en el dispositivo del usuario.

## 📝 Licencia

Uso interno de la empresa.


