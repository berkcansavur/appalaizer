# Appalaizer

![Appalaizer Software Analysis Flowchart](./appalaizer-logo.webp)

Appalaizer is an NPM package designed to optimize your development processes by analyzing the structure and relationships within your projects. It allows you to deeply examine your file and folder structures, generate Markdown documentation suitable for Obsidian, and obtain understandable explanations over your code content with AI-powered analysis.

## Features

- **Project Tree Generator:** Turns your project's file and folder structure into a visual tree.
- **Markdown Documentation:** Automatically generates Markdown documents compatible with Obsidian.
- **AI-Powered Analysis:** Analyzes your code using OpenAI's GPT models.
- **Interactive CLI:** Offers an easy-to-use command-line interface.
- **Flexible and Extensible:** Compatible with various project structures and languages.

## Usage

After installing Appalaizer, you can run it from the command line in the root directory of your project:



appalaizer --analyze

Creates markdowns of all source directorys structure and generates ai-based documentation

appalaizer --list

Lists all available commands in appalaizer package

appalaizer --md

Creates only md files as structure (faster but there will be no analysis.)

## Support & Contact and Contribution

For your problems or suggestions, you can contact us via [GitHub issues](https://github.com/berkcansavur/appalaizer/issues).

## Installation

NPM kullanarak Appalaizer'ı projenize ekleyin:

```sh
npm install appalaizer

