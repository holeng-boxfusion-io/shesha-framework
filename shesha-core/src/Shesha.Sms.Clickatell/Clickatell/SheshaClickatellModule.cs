﻿using Abp.AspNetCore;
using Abp.AspNetCore.Configuration;
using Abp.Modules;
using Castle.MicroKernel.Registration;
using Shesha.Modules;
using Shesha.Settings.Ioc;
using System.Reflection;

namespace Shesha.Sms.Clickatell
{
    [DependsOn(typeof(SheshaFrameworkModule), typeof(SheshaApplicationModule), typeof(AbpAspNetCoreModule))]
    public class SheshaClickatellModule : SheshaModule
    {
        public const int DefaultSingleMessageMaxLength = 160;
        public const int DefaultMessagePartLength = 153;

        public const string ModuleName = "Shesha.Clickatell";
        public override SheshaModuleInfo ModuleInfo => new SheshaModuleInfo(ModuleName)
        {
            FriendlyName = "Shesha Clickatell",
            Publisher = "Boxfusion"
        };

        public override void PreInitialize()
        {
            Configuration.Modules.AbpAspNetCore().CreateControllersForAppServices(
                this.GetType().Assembly,
                moduleName: "SheshaClickatell",
                useConventionalHttpVerbs: true);
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());

            IocManager.RegisterSettingAccessor<IClickatellSettings>(s => {
                s.Host.WithDefaultValue("api.clickatell.com");
                s.SingleMessageMaxLength.WithDefaultValue(DefaultSingleMessageMaxLength);
                s.MessagePartLength.WithDefaultValue(DefaultMessagePartLength);
            });

            IocManager.IocContainer.Register(
                Component.For<IClickatellSmsGateway>().Forward<ClickatellSmsGateway>().ImplementedBy<ClickatellSmsGateway>().LifestyleTransient()
            );
        }
    }
}
