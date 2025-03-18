let doc;

document.getElementById('document-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const formData = new FormData()
    formData.append('file', file);
    fetch("/file-upload", {
        method: 'POST',
        body: formData
    }).then(response => response.text()).then(
        text => doc = text
    ).catch((error) => console.error(error))
  });