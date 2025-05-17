# GitPrune

GitPrune is a modern web application that helps developers efficiently manage their `.gitignore` files by merging project-specific rules with GitHub's official templates.

![GitPrune Screenshot](https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

## Features

- 🔄 Merge GitHub templates with project-specific `.gitignore` rules
- 🎯 Automatically detect and highlight new entries
- 🚫 Eliminate duplicate entries while preserving comments and formatting
- 📋 One-click copy of merged results
- 🌙 Beautiful dark mode interface
- 🎨 Responsive design for all screen sizes

## Usage

1. Visit [GitHub's gitignore templates](https://github.com/github/gitignore)
2. Copy your desired template
3. Paste the template into the left input
4. Paste your project's `.gitignore` into the right input
5. Click "Merge .gitignore Files"
6. Review the merged result with highlighted new entries
7. Copy the result to your clipboard

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide Icons

## License

MIT License - feel free to use this project however you'd like!
