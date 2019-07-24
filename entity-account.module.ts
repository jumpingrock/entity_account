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

import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { BaseModule } from '../../framework/core.module';
import { SharedModule }   from '../../shared/shared.module';

import { KeepValueDirective } from '../../framework/directives/keepvalue.directive';

import { routing } from './entity-account.route';
import { EntityAccountComponent } from './entity-account.component';
import { EntityAccountInquiryComponent } from './entity_account_inquiry/entity-account-inquiry.component';
import { EntityAccountApprovalComponent } from './entity_account_approval/entity-account-approval.component';

import { EntityAccountService } from './entity-account.service';


@NgModule({
  imports:      [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule,
    routing,
    SharedModule ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [ EntityAccountComponent, EntityAccountInquiryComponent, EntityAccountApprovalComponent],
  providers: [ EntityAccountService ],
  bootstrap:    [ EntityAccountComponent ]
})

export class EntityAccountModule extends BaseModule{
}