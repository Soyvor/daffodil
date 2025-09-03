# Development Guide

## Testing the ng-add Schematic Locally

To test the `ng-add` schematic in a fresh Angular application locally, follow these steps:

### 1. Build the Schematic Package

From the root of the Daffodil repository:

```bash
# Install dependencies
npm install

# Build if there's a build script available
npm run build
```

### 2. Create a Test Angular Application

```bash
# Create a new Angular app in a separate directory
ng new test-daffodil-app
cd test-daffodil-app
```

### 3. Testing Methods

#### Method 1: Using npm link

```bash
cd dist/commerce
npm link

# In your test Angular app directory
cd /path/to/test-daffodil-app
npm link @daffodil/commerce

# Run the schematic
ng add @daffodil/commerce
```

#### Method 2: Using npm pack (Recommended)

```bash
# From the repo root
# This create a new daffodil-commerce-0.0.0-PLACEHOLDER.tgz file in your dist/commerce folder.
npx nx run @daffodil/commerce:pack

# Install the package.
cd /path/to/test-daffodil-app
npm install /path/to/daffodil-commerce-0.0.0-PLACEHOLDER.tgz

# Run the schematic
ng add @daffodil/commerce
```

### 4. Verification Steps

After running the schematic, verify that:

- [ ] New files have been created as expected
- [ ] Dependencies have been added to `package.json`
- [ ] Configuration changes have been applied correctly
- [ ] The application builds successfully: `ng build`
- [ ] The application serves without errors: `ng serve`

### 5. Development Workflow

For iterative development and testing:

1. Make changes to your schematic code in `/tools/schematics/`
2. Rebuild the package if necessary
3. Create a fresh test Angular app or reset your existing test app
4. Re-install and run the schematic using one of the methods above
5. Verify the changes work as expected
6. Repeat until satisfied

### Troubleshooting

#### Common Issues

- **Angular CLI version mismatch**: Ensure your Angular CLI version is compatible with the schematic's Angular version requirements
- **Peer dependency warnings**: Check that all peer dependencies are satisfied in your test application
- **Linking issues**: If `npm link` doesn't work reliably, use the `npm pack` method instead

#### Debugging Tips

- Check the schematic's console output for detailed error messages
- Verify the `collection.json` and `package.json` configurations are correct
- Test with a completely fresh Angular application to avoid conflicts
- Use `ng add @daffodil/commerce --dry-run` to see what changes would be made without applying them

### Clean Up

After testing, clean up your test environment:

```bash
# Remove the test application
rm -rf test-daffodil-app

# Unlink the package (if you used npm link)
cd dist/commerce
npm unlink

# Remove any .tgz files created during testing
rm *.tgz
```