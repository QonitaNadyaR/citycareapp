import { reportMapper } from '../../data/api-mapper';

export default class BookmarkPresenter {
    #view;
    #model;

    constructor({ view, model }) {
        this.#view = view;
        this.#model = model;
    }

    async showReportsListMap() {
        this.#view.showMapLoading();
        try {
            await this.#view.initialMap();
        } catch (error) {
            console.error('showReportsListMap: error:', error);
            // Anda mungkin ingin menambahkan penanganan error di view di sini,
            // contoh: this.#view.showMapError(error.message);
        } finally {
            this.#view.hideMapLoading();
        }
    }

    async initialGalleryAndMap() {
        this.#view.showReportsListLoading();

        try {
            // Panggil metode untuk menampilkan peta terlebih dahulu
            await this.showReportsListMap();

            const listOfReports = await this.#model.getAllReports();
            const reports = await Promise.all(listOfReports.map(reportMapper));

            const message = 'Berhasil mendapatkan daftar laporan tersimpan.';
            this.#view.populateBookmarkedReports(message, reports);
        } catch (error) {
            console.error('initialGalleryAndMap: error:', error);
            this.#view.populateBookmarkedReportsError(error.message);
        } finally {
            this.#view.hideReportsListLoading();
        }
    }
}