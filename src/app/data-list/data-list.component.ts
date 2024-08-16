import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.css']
})
export class DataListComponent implements OnInit {
  data: any[] = [];
  sortedData: any[] = [];
  filteredData: any[] = [];
  sortAscending = true;
  searchQuery: string = '';
  predefinedData = {
    job: 'Software Engineer',
    mobile: '+1234567890',
    skill: 'Angular, TypeScript',
    education: 'Bachelor of Computer Science',
    fullAddress: '123 Main St, Springfield, USA'
  };

  selectedUser: any = null;
  showEditForm: boolean = false;

  currentPage: number = 1;
  pageSize: number = 10;
  paginatedData: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getData().subscribe((response) => {
      this.data = response.map(user => ({
        ...user,
        job: this.predefinedData.job,
        mobile: this.predefinedData.mobile,
        skill: this.predefinedData.skill,
        education: this.predefinedData.education,
        fullAddress: this.predefinedData.fullAddress
      }));

      this.sortedData = [...this.data];
      this.filterData();
    });
  }

  sortByName(): void {
    this.sortAscending = !this.sortAscending;
    this.sortedData.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) return this.sortAscending ? -1 : 1;
      if (nameA > nameB) return this.sortAscending ? 1 : -1;
      return 0;
    });
    this.filterData();
  }

  filterData(): void {
    this.filteredData = this.sortedData.filter(user => {
      const query = this.searchQuery.toLowerCase();
      return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
  }

  showMore(): void {
    this.currentPage += 1;
    this.updatePagination();
  }

  openEditForm(user: any): void {
    this.selectedUser = { ...user };
    this.showEditForm = true;
  }

  saveChanges(user: any): void {
    const index = this.data.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.data[index] = { ...user };
      this.sortedData = [...this.data];
      this.filterData();
    }
    this.showEditForm = false;
  }

  cancelEdit(): void {
    this.showEditForm = false;
  }
}
