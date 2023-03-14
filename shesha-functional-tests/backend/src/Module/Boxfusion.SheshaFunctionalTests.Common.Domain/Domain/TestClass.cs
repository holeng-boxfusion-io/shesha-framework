﻿using Abp.Domain.Entities;
using Boxfusion.SheshaFunctionalTests.Common.Domain.Domain.Enum;
using Shesha.Domain.Attributes;
using Shesha.EntityReferences;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Boxfusion.SheshaFunctionalTests.Common.Domain.Domain
{
    [Table("SheshaFunctionalTests_TestClasses")]
    [Entity(TypeShortAlias = "Boxfusion.SheshaFunctionalTests.Domain.TestClass")]
    public class TestClass: Entity<Guid>
    {
        /// <summary>
        /// 
        /// </summary>
        public virtual string TestProp { get; set; }

        public virtual JsonCar JsonProp { get; set; }

        [SaveAsJson]
        public virtual IList<JsonCar> TestListOfJsonEntitiesProp { get; set; }

        [ReferenceList("Boxfusion.SheshaFunctionalTests.Domain.Enum", "TestItem")]
        public virtual RefListTestItem? ReflistProp { get; set; }

        [EntityReference(true)]
        public virtual GenericEntityReference SomeGenericProp { get; set; }
    }
}
