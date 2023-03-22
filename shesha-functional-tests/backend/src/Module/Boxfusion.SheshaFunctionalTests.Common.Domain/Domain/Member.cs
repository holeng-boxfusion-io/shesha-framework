﻿using Boxfusion.SheshaFunctionalTests.Common.Domain.Domain.Enum;
using Shesha.Domain;
using Shesha.Domain.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Boxfusion.SheshaFunctionalTests.Common.Domain.Domain
{
    // <summary>
    /// A person within the application that is a Member
    /// </summary>
    [Entity(TypeShortAlias = "SheshaFunctionalTests.Member")]
    public class Member : Person
    {
        /// <summary>
        /// The membership number for the Member
        /// </summary>
        public virtual string MembershipNumber { get; set; }
        /// <summary>
        /// The Members residential address
        /// </summary>
        public virtual string ResidentialAddress { get; set; }
        /// <summary>
        /// The region that the Member belongs to
        /// </summary>
        public virtual Area Region { get; set; }
        /// <summary>
        /// The branch that the Member belongs to
        /// </summary>
        public virtual Area Branch { get; set; }
        /// <summary>
        /// The date when the Members membership started
        /// </summary>
        public virtual DateTime MembershipStartDate { get; set; }
        /// <summary>
        /// The date when the Members membership ended
        /// </summary>
        public virtual DateTime MembershipEndDate { get; set; }
        /// <summary>
        /// Identification document for the Member
        /// </summary>
        [NotMapped]
        public virtual StoredFile IdDocument { get; set; }
        /// <summary>
        /// The status of the membership
        /// </summary>
        public virtual RefListMembershipStatuses? MembershipStatus { get; set; }
        /// <summary>
        /// 
        /// </summary>
        [MultiValueReferenceList("Boxfusion.Health.HealthCommon.Domain.Fhir", "CommonLanguage")]
        public virtual RefListCommunicationLanguage? CommunicationLanguage { get; set; }
        /// <summary>
        /// 
        /// </summary>
        [SaveAsJson]
        public List<ImageAnnotation> ImageAnnotation { get; set; }

    }
}
