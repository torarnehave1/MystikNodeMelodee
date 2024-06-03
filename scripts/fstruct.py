import os

# Define the directory and file structure
structure = {
    "config": ["passport.js"],
    "models": ["User.js"],
    "routes": ["auth.js", "protected.js"],
    ".env": None,
    "app.js": None,
    "package.json": None
}

# Function to create the directory and file structure
def create_structure(base_path, structure):
    for name, content in structure.items():
        path = os.path.join(base_path, name)
        if isinstance(content, dict):
            os.makedirs(path, exist_ok=True)
            create_structure(path, content)
        else:
            os.makedirs(path, exist_ok=True)  # Corrected line
            if content:
                for file in content:
                    open(os.path.join(path, file), 'a').close()
            else:
                open(path, 'a').close()

# Create the structure
create_structure("..", structure)

print("Project structure created successfully!")