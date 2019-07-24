/*
/**
 * =============================================================================
 * COPYRIGHT (C) SOLDERFIELD
 *
 * ALL RIGHTS RESERVED. SOLDERFIELD'S SOURCE CODE IS AN UNPUBLISHED WORK AND
 * THE USE OF COPYRIGH NOTICE DOES NOT IMPLY  OTHERWISE.  THIS  SOURCE  CODE
 * CONTAINS CONFIDENTIAL, TRADE SECRET MATERIAL OF SOLDERFIELD. ANY  ATTEMPT
 * OR PARTICIPATION IN DECIPHERING, DECODING, REVERSE ENGINEERING OR IN  ANY
 * WAY ALTERING THE SOURCE CODE IS STRICTLY  PROHIBITED,  UNLESS  THE  PRIOR
 * WRITTEN CONSENT OF SOLDERFIELD IS OBTAINED.
 * -----------------------------------------------------------------------------
 *
 * @author Jimmy  2018/08/01
 * -----------------------------------------------------------------------------
 * =============================================================================
 */

import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Router } from '../../framework/security/router';

import { EntityAccountComponent } from './entity-account.component';
import { EntityAccountInquiryComponent } from './entity_account_inquiry/entity-account-inquiry.component';
import { EntityAccountApprovalComponent } from './entity_account_approval/entity-account-approval.component';
import { FullLayoutComponent } from '../../layouts/full-layout.component';
import { EntityAccountInquiryFirstComponent } from './entity-account-inquiry-first/entity-account-inquiry-first.component';

export const EntityAccountRoutes: Routes = [
    {
        path: '',
        component: FullLayoutComponent,
        data: {
            breadcrumb: "Payments"
        },
        children: [
            {
                path: '', component: EntityAccountComponent, data: {
                    title: 'Payments / Entity Account Services'
                }
            },
            {
                path: 'search', component: EntityAccountComponent, data: {
                    title: 'Payments / Entity Account Services'
                }
            },
            // {
            //     path: 'inquiry', component: EntityAccountInquiryComponent, data: {
            //         title: 'Payments / Entity Account Services'
            //     }
            // },
			{
                path: 'inquiryfirst', component: EntityAccountInquiryFirstComponent, data: {
                    title: 'Payments / Entity Account Services'
                }
            },
            {
                path: 'approval', component: EntityAccountApprovalComponent, data: {
                    title: 'Payments / Entity Account Services / Approval'
                }
            },
        ]
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(EntityAccountRoutes);