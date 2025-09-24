import os
import re

import pandas as pd


def slugify(text):
    """Convert text to a URL-friendly slug"""
    # Convert to lowercase and replace spaces with hyphens
    slug = re.sub(r"[^\w\s-]", "", text.lower())
    slug = re.sub(r"[-\s]+", "-", slug)
    return slug.strip("-")


def generate_toolkit_mdx(csv_file_path, output_dir):
    """Generate MDX files from CSV data"""

    # Read the CSV file
    df = pd.read_csv(csv_file_path)

    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    for index, row in df.iterrows():
        # Skip rows with empty names
        if pd.isna(row["name"]) or row["name"].strip() == "":
            continue

        # Create filename from name
        filename = slugify(row["name"]) + ".mdx"
        filepath = os.path.join(output_dir, filename)

        # Prepare front matter
        front_matter = {
            "title": row["name"],
            "description": row["description"] if pd.notna(row["description"]) else "",
            "type": row["type"] if pd.notna(row["type"]) else "",
            "status": row["status"] if pd.notna(row["status"]) else "active",
        }

        # Add optional fields if they exist and are not empty
        if (
            pd.notna(row["developed_by_asterisk"])
            and row["developed_by_asterisk"].strip() != ""
        ):
            front_matter["developed_by_asterisk"] = row["developed_by_asterisk"]
            # Set developed_by based on the asterisk content
            if (
                "CNI lab" in row["developed_by_asterisk"]
                or "IISc" in row["developed_by_asterisk"]
            ):
                front_matter["developed_by"] = "CNI Lab, IISc and ICTS Bengaluru"
            elif "Ashoka" in row["developed_by_asterisk"]:
                front_matter["developed_by"] = "Ashoka University"
            else:
                front_matter["developed_by"] = "In House"

        if pd.notna(row["link"]) and row["link"].strip() != "":
            front_matter["link"] = row["link"]

        if pd.notna(row["github_repo"]) and row["github_repo"].strip() != "":
            front_matter["github_repo"] = row["github_repo"]

        if pd.notna(row["contact_email"]) and row["contact_email"].strip() != "":
            front_matter["contact_email"] = row["contact_email"]

        if pd.notna(row["additional_notes"]) and row["additional_notes"].strip() != "":
            front_matter["additional_notes"] = row["additional_notes"]

        # Add empty arrays for team and projects (to be filled manually)
        front_matter["team"] = []
        front_matter["projects"] = []

        # Generate front matter string
        front_matter_str = "---\n"
        for key, value in front_matter.items():
            if isinstance(value, str):
                # Escape quotes in strings
                escaped_value = value.replace('"', '\\"')
                front_matter_str += f'{key}: "{escaped_value}"\n'
            elif isinstance(value, list):
                front_matter_str += f"{key}: {value}\n"
            else:
                front_matter_str += f"{key}: {value}\n"
        front_matter_str += "---\n\n"

        # Generate content
        content = f"# {row['name']}\n\n"
        content += f"{row['description']}\n\n"

        # Add additional sections if data exists
        if (
            pd.notna(row["developed_by_asterisk"])
            and row["developed_by_asterisk"].strip() != ""
        ):
            content += f"## Developed By\n\n{row['developed_by_asterisk']}\n\n"

        if pd.notna(row["additional_notes"]) and row["additional_notes"].strip() != "":
            content += f"## Additional Notes\n\n{row['additional_notes']}\n\n"

        # Write the file
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(front_matter_str + content)

        print(f"Generated: {filename}")


if __name__ == "__main__":
    # Paths
    csv_file = "toolkits_info.csv"
    output_directory = "../src/content/toolkits"

    # Generate MDX files
    generate_toolkit_mdx(csv_file, output_directory)
    print(f"\nAll toolkits MDX files have been generated in {output_directory}")
