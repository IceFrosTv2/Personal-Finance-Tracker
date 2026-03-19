import * as bootstrap from "bootstrap";

export class ToastUtils {
    static checkAndShowError (result) {
        if ( result.error || !result.response || result.response.error ) {
            const toastContainer = document.createElement("div");
            toastContainer.innerHTML = `
                       <div class="toast rounded-3 shadow align-items-center text-white bg-danger border-0" 
                             role="alert" data-bs-autohide="true" data-bs-delay="5000"
                             aria-live="assertive" aria-atomic="true">
                            <div class="toast-header">
                                <i class="bi bi-exclamation-triangle me-2"></i>
                                <strong class="me-auto">Error</strong>
                                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div class="toast-body">
                                ${result?.response?.message || 'Unknown error'}
                            </div>
                       </div>
                     `;
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            const toastElement = toastContainer.firstElementChild;

            document.body.append(toastContainer);
            new bootstrap.Toast(toastElement).show();
            toastElement.addEventListener('hidden.bs.toast', () => toastContainer.remove());
            return true;
        }
        return false;
    }
}
