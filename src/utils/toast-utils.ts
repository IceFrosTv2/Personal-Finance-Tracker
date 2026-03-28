import * as bootstrap from "bootstrap";
import type {HttpResponseType} from "../types/http-response.type";

export class ToastUtils {
    public static checkAndShowError (result: HttpResponseType): boolean {
        const response = result.response as { error?: boolean; message?: string} | null
        if ( result.error || !response || response.error ) {
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
                                ${response?.message || 'Unknown error'}
                            </div>
                       </div>
                     `;
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            const toastElement = toastContainer.firstElementChild;
            if (!toastElement) return true;

            document.body.append(toastContainer);
            new bootstrap.Toast(toastElement).show();
            toastElement.addEventListener('hidden.bs.toast', () => toastContainer.remove());
            return true;
        }
        return false;
    }
}
