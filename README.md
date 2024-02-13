# Ezequiel Abregu Website 2024

This repository contains the source code for the personal website of Ezequiel Abregu.

## Installation

Follow these steps to get the website running on your local machine:

1. Clone the repository to your local machine using Git:

    ```bash
    git clone https://github.com/username/repository.git
    ```

    Replace `username` and `repository` with your GitHub username and the name of this repository.

2. Navigate to the project directory:

    ```bash
    cd repository
    ```

    Replace `repository` with the name of this repository.

3. Open `index.html` in your web browser to view the website.

## How to pre render audio peaks

You can use the [audiowaveform](https://github.com/bbc/audiowaveform) app. 
For example, let's generate peaks for a MP3 file called 'long_clip.mp3'.

Generate JSON-formatted peaks data from the file long_clip.mp3:

```bash
audiowaveform -i long_clip.mp3 -o long_clip.json --pixels-per-second 20 --bits 8
```

To generate waveforms for each audio channel separately, add the '--split-channels' flag long_clip.mp3:

```bash
audiowaveform -i long_clip.mp3 -o long_clip.json --pixels-per-second 20 --bits 8 --split-channels
```

## Contributing

If you want to contribute to this project, please create a new branch, make your changes, and submit a pull request. All contributions are welcome!

## To Do

- [ ] Add Multilanguage (EN, ES, DE). Use Json method.
- [ ] Add CAVE AQUAM and Bow of secrets to audio.html
- [ ] Add Sound Performance article to text.html  

## License

This project is licensed under the terms of the [LICENSE](LICENSE) file.