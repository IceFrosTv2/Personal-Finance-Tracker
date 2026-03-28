import * as bootstrap from 'bootstrap';

export class ModalUtils {
    public static confirm (type: string, onConfirm: () => Promise<void>) {
        let modal = document.getElementById('confirm-modal');
        if ( !modal ) {
            document.body.insertAdjacentHTML('beforeend', `
              <div id="confirm-modal" class="modal fade" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <span id="modal-text" class="modal-text">
                                Are you sure you want to delete this ${type}? Related income will remain uncategorized.
                            </span>
                            <div class="modal-buttons">
                                <button id="confirm-modal__confirm" class="btn btn-danger">Delete</button>
                                <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            `)
            modal = document.body.lastElementChild as HTMLElement;
        }

        const instance = bootstrap.Modal.getInstance(modal) ?? new bootstrap.Modal(modal)
        instance.show();

        const confirmModal = document.getElementById('confirm-modal__confirm');
        if ( !confirmModal ) return;
            confirmModal.addEventListener('click',
            async () => {
                await onConfirm();
                instance.hide();
            }, { once: true });
    }
}
