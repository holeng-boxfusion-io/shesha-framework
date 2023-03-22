﻿using Abp.Domain.Repositories;
using Abp.Runtime.Validation;
using Abp.UI;
using Boxfusion.SheshaFunctionalTests.Common.Domain.Domain;
using Boxfusion.SheshaFunctionalTests.Common.Domain.Domain.Enum;
using Microsoft.AspNetCore.Mvc;
using Shesha;
using Shesha.DynamicEntities.Dtos;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Boxfusion.SheshaFunctionalTests.Common.Application.Services
{
    public class ActivateMembershipAppService : SheshaAppServiceBase
    {
        private readonly IRepository<Member, Guid> _memberRepo;
        private readonly IRepository<MembershipPayment, Guid> _membershipPaymentRepo;

        public ActivateMembershipAppService(IRepository<Member, Guid> memberRepo, IRepository<MembershipPayment, Guid> membershipPaymentRepo)
        {
            _memberRepo = memberRepo;
            _membershipPaymentRepo = membershipPaymentRepo;
        }

        [HttpPut, Route("[action]/{memberId}")]
        public async Task<DynamicDto<Member, Guid>> ActivateMembership(Guid memberId)
        {
            var member = await _memberRepo.GetAsync(memberId);
            var payments = await _membershipPaymentRepo.GetAllListAsync(data => data.Member.Id == memberId);

            var errors = new List<ValidationResult>();

            if (payments.Count == 0) errors.Add(new ValidationResult("There no payments made"));

            double totalAmount = 0;
            payments.ForEach(a =>
            {
                totalAmount += a.Amount;
            });

            if (totalAmount < 100) errors.Add(new ValidationResult("Payments made are less than 100"));

            if (errors.Any()) throw new AbpValidationException("Erros", errors);


            member.MembershipStatus = RefListMembershipStatuses.Active;
            var updatedMember = await _memberRepo.UpdateAsync(member);

            return await MapToDynamicDtoAsync<Member, Guid>(updatedMember);
        }
    }
}