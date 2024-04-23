import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription, filter } from 'rxjs';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '@coreui/angular';
import { QuestionTemplate } from '../../core/models';
import { questionTemplateActions } from 'src/app/core/store/actions';
import { questionTemplateSelectors } from 'src/app/core/store/selectors';
import { QuestionTemplateService } from 'src/app/core/services';
import {
  ActivatedRoute,
  NavigationStart,
  Router,
  Event as RouterEvent,
} from '@angular/router';

@Component({
  selector: 'app-question-template',
  templateUrl: './question-template.component.html',
  styleUrls: ['./question-template.component.scss'],
})
export class QuestionTemplateManagementComponent implements OnInit {
  questionTemplates$: Observable<QuestionTemplate[]>;
  isLoading$: Observable<boolean>;
  totalTemplates: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  selectedTemplateId: number = 0;

  questionTemplateForm: FormGroup;
  editTemplateForm: FormGroup;
  private subscriptions: Subscription = new Subscription();

  viewTemplateData: any = {};
  
  surveyTypes = [
    { SurveyTypeID: 1, SurveyTypeName: 'Stars' },
    { SurveyTypeID: 2, SurveyTypeName: 'Thumbs' },
    { SurveyTypeID: 3, SurveyTypeName: 'Emoticons' },
    { SurveyTypeID: 4, SurveyTypeName: 'Text' },
    { SurveyTypeID: 5, SurveyTypeName: 'NPS' },
    { SurveyTypeID: 6, SurveyTypeName: 'CSAT' },
  ];

  constructor(
    private store: Store,
    private toastr: ToastrService,
    private modalService: ModalService,
    private router: Router,
    private route: ActivatedRoute,
    private questionTemplateService: QuestionTemplateService
  ) {
    this.questionTemplates$ = this.store.select(
      questionTemplateSelectors.selectAllQuestionTemplates
    );
    this.isLoading$ = this.store.select(
      questionTemplateSelectors.selectQuestionTemplatesLoading
    );
    this.questionTemplateForm = new FormGroup({
      TemplateCategory: new FormControl('', [Validators.required]),
      TemplateText: new FormControl('',[Validators.required]),
      SurveyTypeID: new FormControl('', [Validators.required]),
    });

    this.editTemplateForm = new FormGroup({
      TemplateCategory: new FormControl('', [Validators.required]),
      TemplateText: new FormControl('', [Validators.required]),
      SurveyTypeID: new FormControl('', [Validators.required]),
      CreatedAt: new FormControl({value: '', disabled: true}),
      CreatedBy: new FormControl({value: '', disabled: true}),
      UpdatedAt: new FormControl({value: '', disabled: true}),
      UpdatedBy: new FormControl({value: '', disabled: true})
    });
  }

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: RouterEvent) => {
        if (event instanceof NavigationStart) {
          if (event.url === '/question-template') {
            this.router.navigate(['/question-template'], {
              queryParams: { page: 1, pageSize: 10 },
              replaceUrl: true, // This replaces the current state in history
            });
          }
        }
      });

    this.route.queryParams.subscribe((params) => {
      this.currentPage = parseInt(params['page']) || 1;
      this.pageSize = parseInt(params['pageSize']) || 10;
      this.loadQuestionTemplates();
    });

    this.subscriptions.add(
      this.store
        .select(questionTemplateSelectors.selectTotalTemplates)
        .subscribe((total) => {
          this.totalTemplates = total;
          this.totalPages = Math.ceil(this.totalTemplates / this.pageSize);
        })
    );
  }

  loadQuestionTemplates() {
    this.store.dispatch(
      questionTemplateActions.loadQuestionTemplatesRequest({
        page: this.currentPage,
        pageSize: this.pageSize,
      })
    );
  }

  onPageChange(page: number | string) {
    const pageNumber = Number(page);
    if (
      !isNaN(pageNumber) &&
      pageNumber >= 1 &&
      pageNumber <= this.totalPages
    ) {
      this.currentPage = pageNumber;
      this.router.navigate(['/question-template'], {
        queryParams: { page: pageNumber, pageSize: this.pageSize },
      });
      this.loadQuestionTemplates();
    }
  }

  onPageChangePrevious() {
    if (this.currentPage > 1) {
      this.onPageChange(this.currentPage - 1);
    }
  }

  onPageChangeNext() {
    if (this.currentPage < this.totalPages) {
      this.onPageChange(this.currentPage + 1);
    }
  }

  getPaginationRange(
    currentPage: number,
    totalPages: number,
    siblingCount = 1
  ): Array<string | number> {
    const startPage = Math.max(2, currentPage - siblingCount);
    const endPage = Math.min(totalPages - 1, currentPage + siblingCount);
    let pages: Array<number | string> = [];

    if (startPage > 2) {
      pages.push(1, '...');
    } else if (startPage === 2) {
      pages.push(1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push('...', totalPages);
    } else if (endPage === totalPages - 1) {
      pages.push(totalPages);
    }

    return pages;
  }

  deleteQuestionTemplate() {
    this.store.dispatch(
      questionTemplateActions.deleteQuestionTemplateRequest({ templateId: this.selectedTemplateId })
    );
    this.loadQuestionTemplates();
    this.modalService.toggle({ show: false, id: 'deleteQuestionModal' });
  }

  openCreateQuestionModal() {
    this.modalService.toggle({ show: true, id: 'addQuestionModal' });
  }

  openEditModal(templateId: number) {
    this.selectedTemplateId = templateId;
    this.questionTemplateService.getQuestionTemplateById(templateId).subscribe({
      next: (response) => {
        this.editTemplateForm.setValue({
          TemplateCategory: response.TemplateCategory,
          TemplateText: response.TemplateText,
          SurveyTypeID: response.SurveyTypeID,
          CreatedAt: response.CreatedAt,
          CreatedBy: response.CreatedBy,
          UpdatedAt: response.UpdatedAt || 'N/A',
          UpdatedBy: response.UpdatedBy || 'N/A'
        });
        this.modalService.toggle({ show: true, id: 'editTemplateModal' });
      },
      error: () => {
        this.toastr.error('Failed to load template details.');
      }
    });
  }

  saveTemplateChanges() {
    if (this.editTemplateForm.valid) {
      const updatedTemplate = this.editTemplateForm.value;
      console.log(updatedTemplate);
      updatedTemplate.TemplateID = this.selectedTemplateId;
      this.store.dispatch(questionTemplateActions.updateQuestionTemplateRequest({ templateId: this.selectedTemplateId, templateData: updatedTemplate }));
      this.loadQuestionTemplates() 
      this.modalService.toggle({ show: false, id: 'editTemplateModal' });
    } else {
      this.toastr.error('Form is invalid. Please check and try again.');
    }
  }
  

  openDeleteQuestionTemplate(templateId: number) {
    this.selectedTemplateId = templateId;
    this.modalService.toggle({ show: true, id: 'deleteQuestionModal' });
  }

  openViewModal(templateId: number) {
    this.questionTemplateService.getQuestionTemplateById(templateId).subscribe({
      next: (response) => {
        this.viewTemplateData = response;
        this.modalService.toggle({ show: true, id: 'viewTemplateModal' });
      },
      error: () => {
        this.toastr.error('Failed to load template details.');
      }
    });
  }

  createQuestionTemplate() {
    if (this.questionTemplateForm.valid) {
      
      const templateData = this.questionTemplateForm.value;
      
      console.log(templateData);
      // Here, instead of directly dispatching the action, you could call the service
      this.questionTemplateService.createQuestionTemplate(templateData).subscribe({
        next: (response) => {
          if (response.status) {
            this.toastr.success('Template created successfully');
            this.questionTemplateForm.reset();
            this.modalService.toggle({ show: false, id: 'addQuestionModal' });
            this.loadQuestionTemplates();
          } else {
            // Handle the case where response.status is false
            this.toastr.error('Template creation failed: ' + response.message);
          }
        },
        error: (error) => {
          // Handle the error case
          this.toastr.error('An error occurred while creating the template: ' + error.message);
        }
      });
    } else {
      this.toastr.error('Please fill all required fields.');
    }
  }
  

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
