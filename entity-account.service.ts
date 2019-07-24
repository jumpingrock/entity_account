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

import { Injectable } from '@angular/core';
import { BaseService, ACTION } from '../../framework/core.service';

import { HttpClient } from '../../framework/security/http';
import { DropDown, DropDownValue } from '../../framework/models/core.model';
import { EntityAccount } from './entity-account.model';
import '../../rxjs-operators';
import { environment } from '../../../environments/environment';

@Injectable()
export class EntityAccountService extends BaseService {

    constructor(private http: HttpClient) {
        super();
    }

    preload() : Promise<Map<string, DropDown>> {
        return this.http.do_get(this.getApiLink() + '/preloadAll'+ `?params=help`).then(res => {
            let list:DropDown[] = res.getBody().DropDownList;
            var  map:Map<string, DropDown> = new Map<string, DropDown>();
            list.forEach( item => {
                map.set(item.ApiFieldName, item);
            });
            return map;
        });
    }

    public inputSearch(standardParamInfo:any, entity:any, page_no:number, page_size:number, more_record:string) : Promise<any>{
        return this.http.do_get(this.getApiLink() + '-entity' + standardParamInfo + 
            `&action="${'*LIST'}"` +
            `&no_records=${page_size}` +
            `&more_record="${more_record}"` +
            `&last_key="${page_no}"` +
            `&name="${entity['EntityName']}"` +
            `&legal_id="${entity['UENNo']}"` +
            `&account_no="${entity['AccountNo']}"`
            ).then(res => {
                return res.getBody();
            });
    }

    public entityAccountSearch(standardParamInfo:any, entityNo:any, serviceType:any, page_no:number, page_size:number, more_record:string) : Promise<any>{
        return this.http.do_get(this.getApiLink() + standardParamInfo + 
            `&action="${'*LIST'}"` +
            `&no_records=${page_size}` +
            `&more_record="${more_record}"` +
            `&last_key="${page_no}"` +
            `&entity_no="${entityNo}"` +
            `&service_type="${serviceType}"`
            ).then(res => {
                return res.getBody();
            });
    }

    public entityAccountInquiry(standardParamInfo:any, entityServiceModel:EntityAccount) : Promise<any>{
        return this.http.do_get(this.getApiLink() + standardParamInfo + 
            `&action="${'*INQUIRY'}"` +
            `&entity_no="${entityServiceModel.EntityNumber}"` +
            `&service_type="${entityServiceModel.ServiceType}"` +
            `&account_no="${entityServiceModel.AccountNumber}"` +
            `&account_type="${entityServiceModel.AccountType}"` +
            `&account_currency="${entityServiceModel.AccountCurrency}"`
            ).then(res => {
                return res.getBody();
            });
    }

    public entityAccountSave(standardParamInfo:any, newEntityServiceModel:EntityAccount) : Promise<any>{
        return this.http.mq_post(this.getApiLink() + standardParamInfo + 
            `&action="${'*ADD'}"` +
            `&entity_no="${newEntityServiceModel.EntityNumber}"` +
            `&service_type="${newEntityServiceModel.ServiceType}"` +
            `&account_no="${newEntityServiceModel.AccountNumber}"` +
            `&account_type="${newEntityServiceModel.AccountType}"` +
            `&account_currency="${newEntityServiceModel.AccountCurrency}"` +
            `&account_bic="${newEntityServiceModel.AccountBIC}"` +
            `&sub_id="${newEntityServiceModel.SubId}"` +
            `&description="${newEntityServiceModel.Description}"` +
            `&payment_limit="${newEntityServiceModel.PaymentLimit}"` +
            `&iaft_charge="${newEntityServiceModel.IAFTCharge}"` +
            `&ibft_charge="${newEntityServiceModel.IBFTCharge}"` +
            `&cif_no="${newEntityServiceModel.CIFNumber}"` +
            `&group_ind="${newEntityServiceModel.GroupIndicator}"`
            ).then(res => {
                return res;
            });
    }

    public entitySrvcProviderAccSave(standardParamInfo:any, newEntityServiceModel:EntityAccount, approval_code:string) : Promise<any>{
        return this.http.mq_post(this.getApiLink() + standardParamInfo + 
            `&action="${'*ADD'}"` +
            `&entity_no="${newEntityServiceModel.EntityNumber}"` +
            `&service_type="${newEntityServiceModel.ServiceType}"` +
            `&account_no="${newEntityServiceModel.AccountNumber}"` +
            `&account_type="${newEntityServiceModel.AccountType}"` +
            `&account_currency="${newEntityServiceModel.AccountCurrency}"` +
            `&account_bic="${newEntityServiceModel.AccountBIC}"` +
            `&sub_id="${newEntityServiceModel.SubId}"` +
            `&description="${newEntityServiceModel.Description}"` +
            `&payment_limit="${newEntityServiceModel.PaymentLimit}"` +
            `&iaft_charge="${newEntityServiceModel.IAFTCharge}"` +
            `&ibft_charge="${newEntityServiceModel.IBFTCharge}"` +
            `&cif_no="${newEntityServiceModel.CIFNumber}"` +
            `&group_ind="${newEntityServiceModel.GroupIndicator}"` +
            `&approval_code="${approval_code}"`
            ).then(res => {
                return res;
            });
    }
    

    public entityAccountUpdate(standardParamInfo:any, entityServiceModel:EntityAccount) : Promise<any>{
        return this.http.mq_put(this.getApiLink() + standardParamInfo + 
            `&action="${'*UPDATE'}"` +
            `&entity_no="${entityServiceModel.EntityNumber}"` +
            `&service_type="${entityServiceModel.ServiceType}"` +
            `&account_no="${entityServiceModel.AccountNumber}"` +
            `&account_type="${entityServiceModel.AccountType}"` +
            `&account_currency="${entityServiceModel.AccountCurrency}"` +
            `&account_bic="${entityServiceModel.AccountBIC}"` +
            `&sub_id="${entityServiceModel.SubId}"` +
            `&description="${entityServiceModel.Description}"` +
            `&payment_limit="${entityServiceModel.PaymentLimit}"` +
            `&iaft_charge="${entityServiceModel.IAFTCharge}"` +
            `&ibft_charge="${entityServiceModel.IBFTCharge}"` +
            `&group_ind="${entityServiceModel.GroupIndicator}"`
            ).then(res => {
                return res;
            });
    }

    public entityAccountDelete(standardParamInfo:any, entityServiceModel:EntityAccount) : Promise<any>{
        return this.http.do_delete(this.getApiLink() + standardParamInfo + 
            `&action="${'*DELETE'}"` +
            `&entity_no="${entityServiceModel.EntityNumber}"` +
            `&service_type="${entityServiceModel.ServiceType}"` +
            `&account_no="${entityServiceModel.AccountNumber}"` +
            `&account_type="${entityServiceModel.AccountType}"` +
            `&account_currency="${entityServiceModel.AccountCurrency}"`
            ).then(res => {
                return res;
            });
    }

    public accountSearch(standardParamInfo:any, accountNo:any) : Promise<any>{
        return this.http.do_get(this.getApiLink() + '-check' + standardParamInfo + 
            `&action="${'*INQUIRY'}"` +
            `&account_no="${accountNo}"` +
            `&account_type="${'CUR'}"` +
            `&account_currency=""`
            ).then(res => {
                return res.getBody();
            });
    }

}