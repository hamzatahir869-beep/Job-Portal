document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("reviewForm");
    const msgBox = document.getElementById("successMessage");
    if (!form) return;

    const submitBtn = form.querySelector('.frr-submit-btn');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : "";

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const fullName = document.querySelector('input[name="FullName"]').value.trim();
        const email = document.querySelector('input[name="Email"]').value.trim();
        const phoneNumber = document.querySelector('input[name="PhoneNumber"]').value.trim();
        const currentJobTitle = document.querySelector('input[name="CurrentJobTitle"]').value.trim();
        if (!fullName || !email || !phoneNumber || !currentJobTitle) {
            showNotice("All fields are required.", "danger");
            return;
        }
        const fileInput = document.getElementById('frrFileInput');
        if (!fileInput.files || fileInput.files.length === 0) {
            showNotice("Please upload your resume before submitting.", "danger");
            return;
        }

        setLoading(true);

        try {
            let formData = new FormData(form);
            let response = await fetch(form.action, {
                method: "POST",
                body: formData
            });
            let data = await response.json();
            if (data.success) {
                showNotice(data.message, "success");
                form.reset();
                if (fileInput) {
                    fileInput.value = "";
                }
                const uploadText = document.querySelector('.frr-upload-text');
                if (uploadText) {
                    uploadText.innerText = "Click to upload or drag and drop";
                }
                document.getElementById("free-review").scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
                showNotice(data.message, "danger");
            }
        } catch (err) {
            console.log("Error:", err);
            showNotice("Something went wrong. Please try again.", "danger");
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        if (!submitBtn) return;
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...`;
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }

    function showNotice(text, type) {
        if (!msgBox) return;
        msgBox.classList.remove("d-none", "alert-success", "alert-danger");
        msgBox.classList.add(`alert-${type}`);
        msgBox.innerText = text;
        setTimeout(function () {
            msgBox.classList.add("d-none");
        }, 10000);
    }
});