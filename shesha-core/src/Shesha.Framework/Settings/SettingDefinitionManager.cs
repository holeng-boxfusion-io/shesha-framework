﻿using Abp;
using Abp.Collections.Extensions;
using Abp.Dependency;
using Abp.Reflection;
using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;

namespace Shesha.Settings
{
    /// <summary>
    /// Setting definition manager
    /// </summary>
    public class SettingDefinitionManager : ISettingDefinitionManager, ISingletonDependency
    {
        private readonly ITypeFinder _typeFinder;
        private readonly IIocManager _iocManager;

        protected Lazy<IDictionary<SettingIdentifier, SettingDefinition>> SettingDefinitions { get; }

        public SettingDefinitionManager(ITypeFinder typeFinder, IIocManager iocManager)
        {
            _typeFinder = typeFinder;
            _iocManager = iocManager;

            SettingDefinitions = new Lazy<IDictionary<SettingIdentifier, SettingDefinition>>(CreateSettingDefinitions, true);
        }

        protected virtual IDictionary<SettingIdentifier, SettingDefinition> CreateSettingDefinitions()
        {
            var definitionProvidersTypes = _typeFinder.Find(t => t.IsPublic && 
                    !t.IsAbstract && 
                    !t.IsGenericType && 
                    typeof(ISettingDefinitionProvider).IsAssignableFrom(t) &&
                    _iocManager.IsRegistered(t)
                ).ToList();

            var definitionProviders = definitionProvidersTypes.Select(t => _iocManager.Resolve(t) as ISettingDefinitionProvider).ToList();

            var settings = new Dictionary<SettingIdentifier, SettingDefinition>();
            foreach (var definitionProvider in definitionProviders)
            {
                definitionProvider.Define(new SettingDefinitionContext(settings, definitionProvider));
            }
            return settings;
        }

        public virtual SettingDefinition Get(string moduleName, string name)
        {
            Check.NotNull(moduleName, nameof(moduleName));
            Check.NotNull(name, nameof(name));

            var setting = GetOrNull(moduleName, name);

            if (setting == null)
            {
                throw new AbpException("Undefined setting: " + name);
            }

            return setting;
        }

        public virtual IReadOnlyList<SettingDefinition> GetAll()
        {
            return SettingDefinitions.Value.Values.ToImmutableList();
        }

        public virtual SettingDefinition GetOrNull(string moduleName, string name)
        {
            return SettingDefinitions.Value.GetOrDefault(new SettingIdentifier(moduleName, name));
        }
    }
}
