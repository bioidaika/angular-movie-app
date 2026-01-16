import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiService } from '../../api/api.service';

interface DownloadSource {
    sheet_name: string;
    size: string;
    uploader: string;
    download_url: string;
}

@Component({
    selector: 'app-vietmediaf-download',
    templateUrl: './vietmediaf-download.component.html',
    styleUrls: ['./vietmediaf-download.component.scss']
})
export class VietMediafDownloadComponent implements OnChanges {
    @Input() id!: number;
    @Input() type: 'movie' | 'tv' = 'movie';

    loading = false;
    error: string | null = null;
    sources: DownloadSource[] = [];

    constructor(private apiService: ApiService) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['id'] && this.id) {
            this.fetchData();
        }
    }

    fetchData() {
        this.loading = true;
        this.error = null;
        this.sources = [];

        this.apiService.getVietMediaFLink(this.id, this.type).subscribe({
            next: (data) => {
                this.loading = false;
                if (data && data.sources && Array.isArray(data.sources)) {
                    this.sources = data.sources;
                } else {
                    // Handle case where API returns success but no sources or irregular format
                    // Assuming API always returns sources array if valid
                }
            },
            error: (err) => {
                this.loading = false;
                console.error('VietMediaF API Error:', err);
                this.error = 'Không thể tải link hoặc chưa có link cho phim này.';
            }
        });
    }
}
