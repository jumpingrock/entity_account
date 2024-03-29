export class AuditInformation{
    CheckerCode                 = "";    
    CheckerId                   = "";
    CheckerTimestamp            = "";
    CreateCheckerCode           = "";
    CreateCheckerId             = "";
    CreateCheckerTimestamp      = "";
    CreateMakerId               = "";
    CreateMakerTimestamp        = "";
    MakerId                     = "";
    MakerTimestamp              = "";
    RecordSessId                = "";
    RecordSignature             = "";
    RecordType                  = "";
}

export class Search {
    SearchInput: string         = "";
    SearchType: string          = "entityName";
    BOCode: string              = "";
    BOType: string              = "";
    DomicileCountry: string     = "";
    EntityNumber: string        = "";
    Name: string                = "";
    Status: string              = "";
}

export class EntityAccount {
    AuditInformation: AuditInformation;
    EntityNumber: string                             = "";
    Name: string                                     = "";
    ServiceType: string                              = "";
    ServiceTypeDescription                           = "";
    CIFNumber:string                                 = "";
    AccountNumber: string                            = "";
    AccountType: string                              = "";
    AccountTypeDescription: string                   = "";
    AccountCurrency:string                           = "";
    AccountCurrencyDescription: string               = "";
    AccountBIC: string                               = "";
    AccountBICDescription: string                    = "";
    SubId: string                                    = "OA";
    SubIdDescription: string                         = "";
    BeneBIC: string                                  = "";
    BeneAccountNumber: string                        = "";
    BeneAccountType: string                          = "";
    Status:string                                    = "";
    StatusDate:string                                = "";
    Description: string                              = "";
    PurposeCode: string                              = "";
    DailyMaxAmount: string                           = "";
    DailyMaxCount: string                            = "";
    MtdMaxAmount: string                             = "";
    MtdMaxCount: string                              = "";
    PaymentLimit: string                             = "0.00";
    IAFTCharge: string                               = "0.00";
    IBFTCharge: string                               = "0.00";
    ServiceCharge: string                            = "";
    ItemCharge: string                               = "";
    ReturnCharge: string                             = "";
    Charge1: string                                  = "";
    Charge2: string                                  = "";
    DailyAggregateAmount: string                     = "";
    DailyAggregateCount: string                      = "";
    MtdAggregateAmount: string                       = "";
    MtdAggregateCount: string                        = "";
    AggregateBusinessDate: string                    = "";
    LastDailyAmount: string                          = "";
    LastDailyCount: string                           = "";
    LastMtdAmount: string                            = "";
    LastMtdCount: string                             = "";
    CreditBeneficiaryMethod: string                  = "";
    ServiceLevel: string                             = "";
    CreditDateIndicator: string                      = "";
    DebitDateIndicator: string                       = "";
    AdvanceDays: string                              = "";
    LeadDay: string                                  = "";
    TerminateReason: string                          = "";
    TerminationEffectiveDate: string                 = "";
    LastSuspensionDate: string                       = "";
    LastReinstateDate: string                        = "";
    EffectiveDate: string                            = "";
    FinalCollectionDate: string                      = "";
    Date1: string                                    = "";
    Date2: string                                    = "";
    Date3: string                                    = "";
    GroupIndicator: string                           = "";
    MailCode: string                                 = "";
    UIC1: string                                     = "";
    UIC2: string                                     = "";
    UIC3: string                                     = "";
    UIC4: string                                     = "";
    UIC5: string                                     = "";
    UIC6: string                                     = "";
    UIC7: string                                     = "";
    UIC8: string                                     = "";
    Text1: string                                    = "";
    Text2: string                                    = "";
    Text3: string                                    = "";
    BatchId: string                                  = "";
    SearchInput: string                              = "";
    SearchType: string                               = "";
}

export class UrlInfo {
	SearchInput: string = "";
	SearchType: string = "";
	Origination: string = "";
	EntityNo: string = "";
	EntityName: string = "";
	SearchPage: string = "";
	InqPage: number = 0;
	RaProxy: string = "";
	RaType: string = "";
	CcyCd: string= "";
	Category: string ="";
	Identification: string = "";
	Chargety: string ="";
	Segment: string = "";
	Paginator3: number =0;
	
}