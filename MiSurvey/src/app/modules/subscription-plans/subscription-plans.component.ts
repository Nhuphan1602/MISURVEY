// src/app/components/subscription-plans/subscription-plans.component.ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, map } from 'rxjs';
import { Permission } from 'src/app/core/models';
import { ServicePackageService } from 'src/app/core/services';
import { userSelector } from 'src/app/core/store/selectors';
@Component({
  selector: 'app-subscription-plans',
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.scss']
})
export class SubscriptionPlansComponent implements OnInit {
  plans: any[] = [];
  activePackage: any;
  userPermissions$: Observable<Permission | undefined> | undefined;

  constructor(
    private servicePackageService: ServicePackageService,
    private store: Store
  ) {

    this.userPermissions$ = combineLatest([
      this.store.select(userSelector.selectCurrentUser),
      this.store.select(userSelector.selectPermissionByModuleName('Subscription Plans'))
    ]).pipe(
      map(([currentUser, permissions]) => {
        if (currentUser?.UserRole === 'Supervisor') {
          return permissions;
        }
        return {
          CanView: true,
          CanAdd: true,
          CanUpdate: true,
          CanDelete: true,
          CanExport: true,
          CanViewData: true,
        } as Permission;
      })
    );

  }

  ngOnInit(): void {
    // Load all service packages
    this.servicePackageService.getAllServicePackages().subscribe(data => {
      this.plans = data.map((pkg: any) => ({
        id: pkg.PackageID,
        name: pkg.PackageName,
        description: pkg.Features,
        price: pkg.Price,
        duration: pkg.Duration === -1 ? 'Unlimited' : `${pkg.Duration} days`,
        surveyLimit: pkg.SurveyLimit,
        responseLimit: pkg.ResponseLimit,
        sharingMethods: pkg.ShareMethod.split(', ')
      }));
    });

    // Get the active package from the store
    this.store.select(userSelector.selectCurrentUserPackages).subscribe(packageData => {
      this.activePackage = packageData ? packageData.servicePackage : null;
    });
  }

  initiatePayment(planId: number): void {
    const bankCode = ''; // Customize or get from the user input if required
    const language = 'vn'; // Customize based on user preference or system settings
    this.servicePackageService.initiatePayment(planId, bankCode, language).subscribe(response => {
      window.location.href = response.vnpUrl;
    }, error => {
      console.error('Payment initiation failed:', error);
    });
  }

  formatPrice(price: number): string {
    if (price === 0) {
      return '0đ';
    } else {
      return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
  }

  isActivePlan(planId: number): boolean {
    return this.activePackage && this.activePackage.PackageID === planId;
  }
}
