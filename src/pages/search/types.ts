export type PoiType = {
    DataProvider: {
        WebsiteURL: string;
        Comments: object;
        DataProviderStatusType: {
            IsProviderEnabled: boolean;
            ID: number;
            Title: string;
        };
        IsRestrictedEdit: boolean;
        IsOpenDataLicensed: boolean;
        IsApprovedImport: boolean;
        License: string;
        DateLastImported: object;
        ID: number;
        Title: string;
    };
    OperatorInfo: {
        WebsiteURL: string;
        Comments: object;
        PhonePrimaryContact: object;
        PhoneSecondaryContact: object;
        IsPrivateIndividual: boolean;
        AddressInfo: object;
        BookingURL: object;
        ContactEmail: object;
        FaultReportEmail: object;
        IsRestrictedEdit: boolean;
        ID: number;
        Title: string;
    };
    UsageType: {
        IsPayAtLocation: boolean;
        IsMembershipRequired: boolean;
        IsAccessKeyRequired: boolean;
        ID: number;
        Title: string;
    };
    StatusType: {
        IsOperational: boolean;
        IsUserSelectable: boolean;
        ID: number;
        Title: string;
    };
    SubmissionStatus: { IsLive: boolean; ID: number; Title: string };
    UserComments: object;
    PercentageSimilarity: object;
    MediaItems: object;
    IsRecentlyVerified: boolean;
    DateLastVerified: string;
    ID: number;
    UUID: string;
    ParentChargePointID: object;
    DataProviderID: number;
    DataProvidersReference: object;
    OperatorID: number;
    OperatorsReference: object;
    UsageTypeID: number;
    UsageCost: object;
    AddressInfo: {
        ID: number;
        Title: string;
        AddressLine1: string;
        AddressLine2: object;
        Town: string;
        StateOrProvince: string;
        Postcode: string;
        CountryID: number;
        Country: {
            ISOCode: string;
            ContinentCode: string;
            ID: number;
            Title: string;
        };
        Latitude: number;
        Longitude: number;
        ContactTelephone1: object;
        ContactTelephone2: object;
        ContactEmail: object;
        AccessComments: object;
        RelatedURL: object;
        Distance: number;
        DistanceUnit: number;
    };
    Connections: {
        ID: number;
        ConnectionTypeID: number;
        ConnectionType: {
            FormalName: string;
            IsDiscontinued: object;
            IsObsolete: object;
            ID: number;
            Title: string;
        };
        ChargePrice?: number
        Reference: string | null;
        StatusTypeID: number;
        StatusType: {
            IsOperational: boolean;
            IsUserSelectable: boolean;
            ID: number;
            Title: string;
        };
        LevelID: number;
        Level: {
            Comments: string;
            IsFastChargeCapable: boolean;
            ID: number;
            Title: string;
        };
        Amps: object;
        Voltage: object;
        PowerKW: number | null;
        CurrentTypeID: number;
        CurrentType: { Description: string; ID: number; Title: string };
        Quantity: number;
        Comments: object;
    }[];
    NumberOfPoints: number;
    GeneralComments: object;
    DatePlanned: object;
    DateLastConfirmed: object;
    StatusTypeID: number;
    DateLastStatusUpdate: string;
    MetadataValues: object;
    DataQualityLevel: number;
    DateCreated: string;
    SubmissionStatusTypeID: number;
    LowestChargePrice?: number
    HightChargePrice?: number
    LowestPowerKW?: number
    HightPowerKW?: number
    FastedChargeTime?: number
    CheapestChargeCost?: number
    BestChargeCost?: number
    BestChargeTime?: number
};
