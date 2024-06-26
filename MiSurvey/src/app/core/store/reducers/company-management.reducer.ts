import { createReducer, on } from '@ngrx/store';
import { companyManagementActions } from '../actions';
import { CompanyManagementState } from '../states';

export const initialState: CompanyManagementState = {
  companies: [],
  loading: false,
  selectedCompany: null,
};

export const companyManagementReducer = createReducer(
  initialState,
  on(companyManagementActions.loadCompaniesRequest, (state) => ({
    ...state,
    loading: true,
  })),
  on(companyManagementActions.loadCompaniesSuccess, (state, { companies }) => {
    return {
      ...state,
      companies: companies,
      loading: false,
    };
  }),
  on(companyManagementActions.loadCompaniesFailure, (state) => ({
    ...state,
    loading: false,
  })),
  on(companyManagementActions.loadCompanyByIdRequest, (state) => ({
    ...state,
    loading: true,
  })),
  on(companyManagementActions.loadCompanyByIdSuccess, (state, { company }) => ({
    ...state,
    selectedCompany: company,
    loading: false,
  })),
  on(companyManagementActions.loadCompanyByIdFailure, (state) => ({
    ...state,
    selectedCompany: null,
    loading: false,
  })),
  on(companyManagementActions.updateCompanyRequest, (state) => ({
    ...state,
    loading: true,
  })),
  on(companyManagementActions.updateCompanySuccess, (state, { company }) => ({
    ...state,
    companies: state.companies.map((c) => (c.CompanyID === company.CompanyID ? company : c)),
    loading: false,
    selectedCompany: company, 
  })),

  on(companyManagementActions.updateCompanyFailure, (state) => ({
    ...state,
    loading: false,
  })),
  on(companyManagementActions.createCompanyRequest, (state) => ({
    ...state,
    loading: true,
  })),
  on(companyManagementActions.createCompanySuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(companyManagementActions.createCompanyFailure, (state) => ({
    ...state,
    loading: false,
  })),
  on(companyManagementActions.deleteCompanyRequest, (state) => ({
    ...state,
    loading: true,
  })),
  on(companyManagementActions.deleteCompanySuccess, (state, { CompanyID }) => ({
    ...state,
    companies: state.companies.filter(company => company.CompanyID !== CompanyID),
    loading: false,
  })),
  on(companyManagementActions.deleteCompanyFailure, (state) => ({
    ...state,
    loading: false,
  }))
);
